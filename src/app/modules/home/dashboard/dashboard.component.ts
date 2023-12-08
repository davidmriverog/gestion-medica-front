import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { select, Store } from '@ngrx/store';
import { IAppState, getRoles, getPeriod, IOptionList, IFilterCriterion, FilterTypesEnum, FilterTypeValue } from '../../../exports/lib';

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from '../../../exports/lib';

import { ChartDB } from '../../../fack-db/chart-data';
import { Observable, of, Subscription } from 'rxjs';
import { RoleEnum } from '../../../core/enums/sys/rol-values.enum';
import { AccountingPeriodService } from '../../../project/services/ac/accounting-period.service';
import { MovementService } from '../../../project/services/ac/movement.service';
import { filter, switchMap } from 'rxjs/operators';
import { OperationTypeEnum } from 'src/app/core/enums/ac/operation-type.enum';

import { MovementModel } from "src/app/project/models/ac/movement.model";
import { SaleService } from 'src/app/project/services/ms/sale.service';
import { PlanningMedicalCouponTurnService } from 'src/app/project/services/prog/planning-medical-coupon-turn.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

	@ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;


	public size = 'large-view';
	public showView = false;
	public basicContent: string;
	public chartDB: any;
	public taskRate: number;

	currentUser$: Observable<any>;

	dayFromTitle$: Observable<string>;

	roleEnum = RoleEnum;

	getRole$ = this.store.pipe(
		select(getRoles)
	);

	subcriptionCheckRole: Subscription = new Subscription();
	internalSub: Array<Subscription> = new Array<Subscription>();

	internalLoader: boolean = false;

	lastBalance = 0;
	totalIncome = 0;
	totalExpense = 0;
	balance = 0;

	movements: Array<any> = new Array<any>();

	operationTypeEnum = OperationTypeEnum;

	records$: Observable<IAPIRecords<MovementModel[]>>;

	saleCountDale$: Observable<any>
	dashboardAttentionAdmin$: Observable<any>

	constructor(
		private store: Store<IAppState>,
		private router: Router,
		private accountingPeriodService: AccountingPeriodService,
		private movementService: MovementService,
		private sandboxService: SandboxAPIService,
		private saleService: SaleService,
		private planningCouponService: PlanningMedicalCouponTurnService
	) {
		this.chartDB = ChartDB;
		this.taskRate = 10;
	}

	ngOnInit() {
		this.dayFromTitle$ = of(`Atenciones del día ${moment().format('DD-MM-YYYY')}`);

		this.fetchCurrentAccount();


	}

	onRefresh(criteria: IApiCriteria) {
		this.records$ = this.store.pipe(
			select(getPeriod),
			filter((period) => !!period),
			switchMap((period) => {

				const myFilters: Array<IFilterCriterion> = [
					{
						property: 'accountingPeriodId',
						type: FilterTypesEnum.Equals,
						typeValue: FilterTypeValue.ID,
						value: period._id
					},
				];

				criteria.filters = myFilters;

				return this.sandboxService.listPage<MovementModel>(MovementModel, criteria);
			})
		)
	}

	fetchCurrentAccount(): void {

		this.internalLoader = true;

		this.lastBalance = 0;
		this.totalIncome = 0;
		this.totalExpense = 0;
		this.balance = 0;
		this.movements = [];


		this.internalSub.push(this.store.pipe(
			select(getPeriod),
			filter((period) => !!period),
			switchMap((period) => {
				return this.movementService.currentBalance(period._id)
			})
		).subscribe((result) => {

			this.internalLoader = false;

			if (result) {

				this.lastBalance = result.initBalance;
				this.totalIncome = result.income;
				this.totalExpense = result.expense;
				this.balance = result.profit;
			}


		}))

		this.saleCountDale$ = this.saleService.indicatorDashboardSales()
		this.dashboardAttentionAdmin$ = this.planningCouponService.dashboarIndicatorAttentionAdmin()
	}

	ngOnDestroy(): void {

		if (this.subcriptionCheckRole) {
			this.subcriptionCheckRole.unsubscribe();
		}
	}

	goAttention(): void {
		this.router.navigate(['/att/medic-attention']);
	}

}
