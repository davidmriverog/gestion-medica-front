import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpClient, HttpParams } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Injectable, Component, OnDestroy, OnInit, Input, Output, EventEmitter, ViewChild, ContentChild, TemplateRef, ContentChildren, QueryList, AfterContentInit, ViewChildren, AfterViewInit, forwardRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

import { FilterTypesEnum, IFilterCriterion, ISortingCriterion } from '../../../../interfaces/ui-filter-criterion.interface';
import { IDataTablesResponse, IOptionList } from '../../../../interfaces/datatable.interface';

import { CoreBaseModel } from '../../../../classes/core-base-model.class';
import { BaseFilter } from '../ui-filters/base-filter.class';
import { delay } from 'rxjs/operators';
import { UIModalFilterDatatableComponent } from './modals/ui-modal-filter-datatable.component';

@Injectable()
export class BaseDatatable {

}

@Component({
    selector: 'ui-datatable',
    templateUrl: './ui-datatable.component.html',
    providers: [
        {
            provide: BaseDatatable,
            useExisting: forwardRef(() => UIDatatableComponent),
            multi: true
        }
    ]
})
export class UIDatatableComponent extends BaseDatatable implements OnInit, OnDestroy, AfterContentInit {

    @ViewChild(DataTableDirective, { static: false })
    private datatableElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    @Input()
    cssClass = "table table-striped table-bordered nowrap table-hover";

    @Input()
    optionList: IOptionList;

    @Output()
    records: EventEmitter<Array<any> | Array<CoreBaseModel>> = new EventEmitter();

    dataTablesParameters: any;

    @ContentChild('contentFilter') filtersDefinition!: TemplateRef<any>;
    @ContentChildren(BaseFilter, { descendants: true }) filterComp!: QueryList<BaseFilter>;

    filters: Array<IFilterCriterion> = [];
    afterFilterList: Array<IFilterCriterion> = [];

    sorting: Array<ISortingCriterion>;

    internalSubscription: Array<Subscription> = new Array<Subscription>();

    constructor(
        private http: HttpClient,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit(): void {

        const that = this;

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: this.optionList.pageLength,
            serverSide: true,
            processing: true,
            ordering: false,
            autoWidth: false,
            searching: false,
            ajax: (dataTablesParameters: any, callback, settings: DataTables.SettingsLegacy) => {

                dataTablesParameters.currentPage = Math.ceil(settings._iDisplayStart / settings._iDisplayLength) + 1;

                const definitiveFilter: Array<IFilterCriterion> = [
                    ...this.filters,
                    ...this.afterFilterList,
                ];

                dataTablesParameters.filters = definitiveFilter;
                dataTablesParameters.sorting = this.sorting;

                this.internalSubscription.push(that.fetch(dataTablesParameters).subscribe((resp) => {
                    this.records.emit(resp.data);

                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                }));
            },
            columns: this.optionList.columns,
            language: {
                emptyTable: 'Ningún dato disponible en esta tabla',
                info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
                infoFiltered: '(filtrado de un total de _MAX_ registros)',
                thousands: ',',
                lengthMenu: 'Mostrar _MENU_ registros',
                loadingRecords: 'Cargando registro...',
                processing: 'Procesando....',
                search: 'Buscando...',
                searchPlaceholder: 'Mostrar _MENU_ registros',
                zeroRecords: 'No se encontraron resultados',
                paginate: {
                    first: 'Primero',
                    last: 'Último',
                    next: 'Siguiente',
                    previous: 'Anterior'
                },
                aria: {
                    sortAscending: ': Activar para ordenar la columna de manera ascendente',
                    sortDescending: ': Activar para ordenar la columna de manera descendente'
                }
            }
        };
    }

    ngAfterContentInit(): void {

        this.internalSubscription.push(this.filterComp.changes.subscribe((item) => {

            console.log('filter.init');
        }));
    }

    ngOnDestroy(): void {

        if (this.internalSubscription.length) {
            this.internalSubscription.map(r => r.unsubscribe());
        }
    }

    fetch(dataTablesParameters: any): Observable<IDataTablesResponse<any>> {
        let params = new HttpParams()
            .set('q', btoa(JSON.stringify(dataTablesParameters)));

        return this.http.get<IDataTablesResponse<any>>(`${environment.apiUrl}${this.optionList.apiUrl}`, {
            params: params
        });
    }

    clearFilters(): void {
        this.filters = [];
        this.afterFilterList = [];

        this.refresh();
    }

    refresh(): void {

        console.log('refrescando datos...');

        this.datatableElement.dtInstance.then((dataTable: DataTables.Api) => {
            dataTable.draw();
        });

    }

    sort(values: Array<ISortingCriterion>): void {
        this.sorting = values;
    }

    afterFilters(filters: Array<IFilterCriterion>): void {

        this.afterFilterList = [];

        this.afterFilterList = filters;

        this.refresh();
    }

    openFilter(): void {

        const modalManager = this.modalService.open(UIModalFilterDatatableComponent, {
            size: 'lg',
            backdrop: 'static',
            centered: true
        });

        const modal: UIModalFilterDatatableComponent = modalManager.componentInstance;
        modal.filtersDef = this.filtersDefinition;

        this.internalSubscription.push(modal.afterViewInit.pipe(
            delay(1)
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

        }));

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

            this.refresh();

        }, (reason) => {
            console.log('reason', reason);
        });
    }
}
