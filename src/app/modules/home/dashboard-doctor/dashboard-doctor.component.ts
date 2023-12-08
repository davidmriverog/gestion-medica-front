import { Component, OnInit, AfterContentInit, ViewEncapsulation } from "@angular/core"
import { Router } from "@angular/router"

import * as moment from "moment"

import { select, Store } from "@ngrx/store"
import { IAppState, getRoles, getUserMedic } from "../../../exports/lib"
import { ChartDB } from "../../../fack-db/chart-data"
import { Observable, of } from "rxjs"
import { shareReplay, switchMap, tap, delay } from "rxjs/operators"
import { RoleEnum } from "../../../core/enums/sys/rol-values.enum"
import { ProductCategoryEnum } from "../../../core/enums/ar/product-category.enum"
import { PlanningTurnStatusEnum } from "../../../core/enums/prog/planning-turn-states.enum"

import { PlanningMedicalCouponTurnService } from "../../../project/services/prog/planning-medical-coupon-turn.service"

@Component({
  selector: "app-dashboard-doctor",
  templateUrl: "./dashboard-doctor.component.html",
  styleUrls: ["./dashboard-doctor.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDoctorComponent implements OnInit, AfterContentInit {

  public size = "large-view"
  public showView = false
  public basicContent: string
  public chartDB: any
  public taskRate: number

  currentUser$: Observable<any>

  dayFromTitle$: Observable<string>

  roleEnum = RoleEnum

  getRole$ = this.store.pipe(
    select(getRoles)
  )

  medicalUser$: Observable<any> = this.store.pipe(
    select(getUserMedic)
  )

  attentionLists$: Observable<Array<any>>

  dayAttention: string = moment().format("DD-MM-YYYY")

  dashboardIndicatorDoctor$: Observable<any>
  dashboardIndicatorDoctorProcedures$: Observable<any>

  progressConsultation: number = 0

  planningTurnStatusEnum = PlanningTurnStatusEnum
  productCategoryEnum = ProductCategoryEnum

  now: Date = new Date()

  doctorId: string

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private planningMedicalCouponTurnService: PlanningMedicalCouponTurnService
  ) {
    this.chartDB = ChartDB
    this.taskRate = 10
  }

  ngOnInit() {
    this.fetchAttentions()
  }

  ngAfterContentInit(): void {
    // this.fetchAttentions()
  }

  goAttention(row: any): void {

    switch (row.planningMedicalTurn.productCategory.code) {
      case ProductCategoryEnum.CONS:

        this.router.navigate(["/act/attention-consultation-form", row.saleDetailId], {
          queryParams: {
            patientId: row.detail?.saleInfo?.patientId
          }
        })
        break
      case ProductCategoryEnum.PROC:

        this.router.navigate(["/act/attention-procedure-form", row.saleDetailId], {
          queryParams: {
            patientId: row.detail?.saleInfo?.patientId
          }
        })
        break
    }

  }

  goAttentionFormDetail(row: any) {

    switch (row.planningMedicalTurn.productCategory.code) {
      case ProductCategoryEnum.CONS:

        this.router.navigate(["/act/attention-consultation-form-detail", row.detail.medicalActId])
        break
      case ProductCategoryEnum.PROC:

        this.router.navigate(["/act/attention-procedure-form-detail", row.detail.medicalActId])
        break
    }

  }

  refresh(): void {

    this.fetchAttentions()
  }

  fetchAttentions(): void {

    this.attentionLists$ = this.store.pipe(
      select(getUserMedic)
    ).pipe(
      switchMap((doctor) => {
        return this.planningMedicalCouponTurnService.attentionListOfDayByDoctor(doctor._id)
      })
    )

    this.dashboardIndicatorDoctor$ = this.planningMedicalCouponTurnService.dashboarIndicatordDoctor().pipe(
      shareReplay()
    )
  }

}
