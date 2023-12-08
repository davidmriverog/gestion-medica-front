import { HttpClient } from "@angular/common/http";
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SortMeta, FilterMetadata } from "primeng/api";

import { Table } from "primeng/table";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { delay, takeUntil } from "rxjs/operators";

import { FilterTypesEnum, IApiCriteria, IAPIRecords, IFilterCriterion } from "../../../../interfaces/ui-filter-criterion.interface";
import { BaseFilter } from "../ui-filters/base-filter.class";
import { UIModalFilterTableComponent } from "./modals/ui-modal-filter-table.component";

@Component({
	selector: "ui-admin-table",
	templateUrl: "./ui-admin-table.component.html"
})
export class UIAdminTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, AfterContentInit, AfterViewChecked {

	@Input()
	emptyMessage: string = 'No Record Found';
	@Input()
	loadingMessage: string = 'Loading...';
	@Input()
	paginator: boolean = true;
	@Input()
	pageSize: number = 15;
	@Input()
	totalRecords: number = 0;
	@Input()
	selection: any;
	@Input()
	reordenable: boolean;
	@Input()
	scrollable: boolean;
	@Input()
	scrollHeight: string = "350px";

	@Input()
	cssClass = "";

	@Output()
	selectionChange: EventEmitter<any> = new EventEmitter();

	@Output()
	refresh: EventEmitter<IApiCriteria> = new EventEmitter<IApiCriteria>();

	@ContentChild('contentFiltered') filtersDefinition!: TemplateRef<any>;
	@ContentChildren(BaseFilter, { descendants: true }) filterComp!: QueryList<BaseFilter>;

	filters: Array<IFilterCriterion> = [];
	afterFilterList: Array<IFilterCriterion> = [];

	protected _records = new BehaviorSubject<any>(<any>{});
	protected _loading = new BehaviorSubject<boolean>(<boolean>true);
	protected _apiRecords = new BehaviorSubject<IAPIRecords<any>>(<IAPIRecords<any>>{});

	@ContentChild(Table, { static: true })
	tableRef: Table & { reordenable: boolean };

	@Input()
	set apiRecords(value) {
		this._apiRecords.next(value);
	}

	get apiRecords() {
		return this._apiRecords.getValue();
	}

	@Input()
	set records(value) {
		this._records.next(value);
	}
	get records() {
		return this._records.getValue();
	}

	@Input()
	set loading(value) {
		this._loading.next(value);
	}
	get loading() {
		return this._loading.getValue();
	}

	isFirst: boolean = true;
	isEmpty: boolean = false;

	loaderDatatable: boolean = true;

	private internalSubcription: Array<Subscription> = new Array<Subscription>();

	currentSorting: {
		[field: string]: {
			order: "ascending" | "descending";
		};
	} = {};
	sortingIcon: SafeHtml;

	tableSorting: Array<SortMeta>;

	start: number;
	length: number;

	private destroyed$ = new Subject<void>();

	constructor(
		private sanitizer: DomSanitizer,
		private httpService: HttpClient,
		private cdref: ChangeDetectorRef,
		private modalService: NgbModal
	) { }

	ngOnInit(): void {

		this._apiRecords.subscribe((result) => {
			this.setupApiRecords(result);
		});

		this._records.subscribe(data => this.setupRecords(data));
	}

	ngOnDestroy(): void {
		if (this._apiRecords) {
			this._apiRecords.unsubscribe();
		}

		if (this._records) {
			this._records.unsubscribe();
		}

		if (this.tableRef && this.tableRef.onLazyLoad) {
			this.tableRef.onLazyLoad.unsubscribe();
		}

		if (this.tableRef && this.tableRef.onRowReorder) {
			this.tableRef.onRowReorder.unsubscribe();
		}

		this.destroyed$.next();
		this.destroyed$.complete();
	}

	ngOnChanges(): void {

		if (this.tableRef) {
			this.tableRef.selection = this.selection;
		}
	}

	ngAfterViewInit(): void {

	}

	ngAfterContentInit(): void {

		if (this.tableRef) {
			this.tableRef.lazy = true;
			this.tableRef.paginator = this.paginator;
			this.tableRef.rows = this.pageSize;
			this.tableRef.totalRecords = this.totalRecords;
			this.tableRef.reordenable = this.reordenable;
			this.tableRef.sortMode = "multiple";
			this.tableRef.scrollable = this.scrollable;
			this.tableRef.scrollHeight = this.scrollHeight;
			this.tableRef.loading = true;

			if (this.cssClass != '') {
				this.tableRef.styleClass = this.cssClass;
			}

			this.tableRef.onLazyLoad.subscribe(event => {

				const start = event.first;
				const length = event.rows;

				const pageNumber = Math.round(event.first / this.pageSize) + 1;

				this.start = event.first;
				// this.length = length;



				this.refresh.emit(<IApiCriteria>{
					page: event.first,
					limit: this.pageSize,
					filters: []
				})

				this.cdref.detectChanges();
			});

			this.tableRef.ngOnInit();
		}


	}

	ngAfterViewChecked() {

		if (this.tableRef && this.loading != null) {
			this.cdref.detectChanges();
		}
	}

	protected setupRecords(data) {
		if (this.tableRef && data && JSON.stringify(data) != "{}") {
			this.tableRef.value = data;
			this.isFirst = false;
			this.isEmpty = !data || data.length <= 0;

			this.tableRef.loading = false;
		}
	}

	protected setupApiRecords(result: IAPIRecords<any>) {


		if (result && result.data) {
			this.records = result.data ? result.data : this.records;
			this.pageSize = result && result.limit ? result.limit : this.pageSize;
			this.totalRecords = result && (result.totalRecords || result.totalRecords === 0) ? result.totalRecords : this.totalRecords;

			this.tableRef.rows = this.pageSize;
			this.tableRef.totalRecords = this.totalRecords;
			this.tableRef.paginator = this.totalRecords === 0 ? true : this.paginator;

			if (this.totalRecords == 0) {

			}

			this.tableRef.loading = false;
		}
	}

	refreshing(): void {

		const definitiveFilter: Array<IFilterCriterion> = [
			...this.filters,
			...this.afterFilterList,
		];

		this.refresh.emit(<IApiCriteria>{
			page: this.start,
			limit: this.pageSize,
			filters: definitiveFilter
		})

		this.cdref.detectChanges();
	}

	openFilter(): void {

		const modalManager = this.modalService.open(UIModalFilterTableComponent, {
			size: 'lg',
			backdrop: 'static',
			centered: true
		});

		const modal: UIModalFilterTableComponent = modalManager.componentInstance;
		modal.filtersDef = this.filtersDefinition;

		modal.afterViewInit.pipe(
			delay(1),
			takeUntil(this.destroyed$)
		).subscribe(() => {

			this.filterComp.map((filter) => {

				const currentFilter = this.filters.find((t) => t.property === filter.property && t.value != '');

				if (currentFilter) {

					if (filter.mode == FilterTypesEnum.Equals || filter.mode == FilterTypesEnum.Like) {
						filter.form.patchValue({
							value: currentFilter.value
						});
					}
				}
			});

		})

		modalManager.result.then((fitlers: any) => {

			this.filters = [];

			this.filterComp.map((item) => {

				const criterion = item.criterion;

				if (criterion != null) {

					if (criterion.type != FilterTypesEnum.Between && criterion.value != undefined) {

						this.filters.push(criterion);
					}


					if (criterion.type == FilterTypesEnum.Between && ((criterion.value.from || criterion.value.from === 0) && (criterion.value.to || criterion.value.to === 0))) {

						this.filters.push(criterion);
					}

					if (criterion.and || criterion.or) {

						this.filters.push(criterion);
					}
				}


			});

			this.refreshing();

		}, (reason) => {
			console.log('reason', reason);
		});
	}

	clearFilters(): void {
		this.filters = [];
		this.afterFilterList = [];

		this.refreshing();
	}

}
