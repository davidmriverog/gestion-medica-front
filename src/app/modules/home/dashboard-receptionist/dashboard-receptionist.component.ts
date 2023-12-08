import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { select, Store } from '@ngrx/store';
import { IAppState, getRoles } from '../../../exports/lib';
import { Observable, of } from 'rxjs';
import { RoleEnum } from '../../../core/enums/sys/rol-values.enum';

import { PlanningMedicalCouponTurnService } from '../../../project/services/prog/planning-medical-coupon-turn.service';
import { SaleService } from 'src/app/project/services/ms/sale.service';

@Component({
  selector: 'dashboard-receptionist',
  templateUrl: './dashboard-receptionist.component.html'
})
export class DashboardRecepcionistComponent implements OnInit {

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

  attentionLists$: Observable<Array<any>>;

  dayAttention: string = moment().format('DD-MM-YYYY');

  dashboardIndicatorDoctorConsultation$: Observable<any>;
  dashboardIndicatorDoctorProcedures$: Observable<any>;

  progressConsultation: number = 0;

  saleCountDale$: Observable<any>

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private planningMedicalCouponTurnService: PlanningMedicalCouponTurnService,
    private saleService: SaleService
  ) {
  }

  ngOnInit() {
    this.saleCountDale$ = this.saleService.indicatorDashboardSales()
  }
}
