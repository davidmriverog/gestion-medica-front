import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { delay, filter, map, shareReplay } from 'rxjs/operators';

import * as moment from 'moment';

import { IAppState, getRoles, getUserPatient, IApiCriteria, IAPIRecords } from '../../../exports/lib';

import { RoleEnum } from '../../../core/enums/sys/rol-values.enum';
import { PlanningTurnStatusEnum } from 'src/app/core/enums/prog/planning-turn-states.enum';

import { ActMedicalService } from 'src/app/project/services/act/act-medical.service';
import { ProductCategoryEnum } from 'src/app/core/enums/ar/product-category.enum';

@Component({
  selector: 'dashboard-client',
  templateUrl: './dashboard-client.component.html'
})
export class DashboardClientComponent implements OnInit, AfterContentInit {

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

  patient$: Observable<any> = this.store.pipe(
    select(getUserPatient)
  )

  attentionLists$: Observable<Array<any>>;

  dayAttention: string = moment().format('DD-MM-YYYY');


  dashboardIndicatorDoctorConsultation$: Observable<any>;
  dashboardIndicatorDoctorProcedures$: Observable<any>;

  progressConsultation: number = 0;

  records$: Observable<IAPIRecords<any[]>>

  planningTurnStatusEnum = PlanningTurnStatusEnum;

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private attentionService: ActMedicalService
  ) {
  }

  ngOnInit() {

    //
  }

  ngAfterContentInit(): void {

  }

  goAttentionFormDetail(row: any) {
    this.router.navigate(["/act/attention-consultation-form-detail", row._id])

    switch (row.planningMedicalCouponTurn.planningMedicalTurn.productCategory.code) {
      case ProductCategoryEnum.CONS:

        this.router.navigate(["/act/attention-consultation-form-detail", row._id])
        break
      case ProductCategoryEnum.PROC:

        this.router.navigate(["/act/attention-procedure-form-detail", row._id])
        break
    }
  }

  onRefresh(criteria: IApiCriteria) {

    this.records$ = this.attentionService.listPaginateAttentionPatient(criteria)
	}

  showAge(date: Date): string {

    const now = moment()

    const diffAge = now.diff(moment(new Date(date)), "years")


    return `${diffAge} Año(s) ${now.format("M")} Mes(es)`
  }
}
