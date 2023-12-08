import { Component, OnInit, ViewChild } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { Store } from "@ngrx/store"
import * as _ from "lodash"
import * as moment from "moment-timezone"
import Swal from "sweetalert2"

import { Observable, of } from "rxjs"
import { filter, first, mergeMap, shareReplay, switchMap } from "rxjs/operators"

import { SandboxAPIService, IFilterCriterion, FilterTypeValue, FilterTypesEnum, IContextService, IAppState, IApiCriteria, UIAdminTableComponent, IAPIRecords, convertUTCDate } from "src/app/exports/lib"
import { PlanningTurnStatusEnum } from "../../../core/enums/prog/planning-turn-states.enum"
import { PlanningMedicalCouponTurnService } from "src/app/project/services/prog/planning-medical-coupon-turn.service"
import {  PlanningMedicalTurnService } from "src/app/project/services/prog/planning-medical-turn.service"

import { AccountingPeriodModel } from "src/app/project/models/ac/accounting-period.model"
import { MedicalOfficeModel } from "src/app/project/models/clinic/medical-office.model"
import { PlanningMedicalTurnModel } from "src/app/project/models/prog/planning-medical-turn.model"

@Component({
  selector: "programming-list",
  templateUrl: "./programming-list.component.html"
})
export class ProgramingListComponent implements OnInit {

  medicalOffice$: Observable<MedicalOfficeModel>
  periods$: Observable<AccountingPeriodModel[]>

  currentPeriod: any

  attentionDate: moment.Moment
  displayDate: string
  medicalOfficeId: string

  displayProg: boolean = false
  planningTurnStatusEnum = PlanningTurnStatusEnum

  dayQuery: string

  couponEvents$: Observable<Array<any>>

  counponSelected: any

  available: number = 0
  pending: number = 0
  anulated: number = 0
  attended: number = 0
  total: number = 0

  couponEvents: Array<any> = new Array<any>()

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<PlanningMedicalTurnModel[]>>

  date$: Observable<string>


  constructor(
    private sandboxService: SandboxAPIService,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute,
    private contextService: IContextService,
    private planningMedicalCouponTurnService: PlanningMedicalCouponTurnService,
    private planningMedicalTurnService: PlanningMedicalTurnService
  ) {

  }

  ngOnInit() {

    this.medicalOffice$ = this.route.queryParams.pipe(
      filter((param) => !!param["medicalOfficeId"]),
      switchMap((param) => {

        this.medicalOfficeId = param["medicalOfficeId"]

        return this.sandboxService.findById<MedicalOfficeModel>(MedicalOfficeModel, param["medicalOfficeId"])
      }),
      shareReplay()
    )

    this.date$ = this.route.queryParams.pipe(
      filter((param) => !!param["day"]),
      mergeMap((param) => {

        const nowDate = moment().format("YYYY-MM-DD")


        const now = moment.utc(nowDate).startOf("days").toDate()

        const attentionDAte = moment.utc(param["day"]).startOf("days").toDate()

        this.attentionDate = moment.utc(param["day"]).startOf("days")

        if (attentionDAte >= now) {
          this.displayProg = true
        } else {
          this.displayProg = false
        }

        return of(this.attentionDate.format("DD-MM-YYYY"))
      }),
      first(),
      shareReplay()
    )
  }

  goBack(): void {
    this.router.navigate(["/prog/programming"])
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.route.queryParams.pipe(
      filter((param) => !!param["medicalOfficeId"]),
      switchMap((param) => {

        const myFilters: Array<IFilterCriterion> = [
          {
            property: "medicalOfficeId",
            type: FilterTypesEnum.Equals,
            typeValue: FilterTypeValue.ID,
            value: param["medicalOfficeId"]
          },
          {
            property: "attentionDate",
            type: FilterTypesEnum.Equals,
            typeValue: FilterTypeValue.DATE,
            value: this.attentionDate.toISOString()
          }
        ]

        criteria.filters = myFilters

        return this.sandboxService.listPage<PlanningMedicalTurnModel>(PlanningMedicalTurnModel, criteria)
      })
    )
  }

  gotProgMedicalTurnDetail(id: string): void {

    this.router.navigate(["/prog/planning-medical-turn-detail", id], {
      queryParams: {
        day: this.attentionDate.format("YYYY-MM-DD"),
        medicalOfficeId: this.medicalOfficeId
      }
    })
  }


  toggleActive(id: string, active: boolean): void {
    const titleMessage: string = `${active == false ? "Inhabilitar" : "Habilitar"} programación médica.`
    const contentMessage: string = `¿Esta seguro de realizar esta operación?, ${active == false ? "Recuerde, que una vez realizado. Los cupos generados en esta programación no estarán disponible para la venta" : "Una vez habilitado la programación, los cupos estarán disponibles para la venta."}`

    Swal.fire({
      title: titleMessage,
      text: contentMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Si, ${active == false ? "Inhabilitar" : "Habilitar"}`,
      cancelButtonText: "No!",
      reverseButtons: true,
      backdrop: true
    }).then((result) => {

      if (result.value) {

        this.contextService.startLoading()

        this.planningMedicalTurnService.toggleActive(id, active).subscribe((response) => {
          Swal.fire(
            "Éxito",
            "Proceso realizado exitosamente",
            "success"
          )

          this.contextService.stopLoading()

          this.onRealTimeUpdate()

        })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

        Swal.fire(
          "Operación cancelada",
          "has cancelado la operación",
          "error"
        )
      }
    })

  }

  addProgramming(): void {
    this.router.navigate(["/prog/planning-turn-create"], {
      queryParams: {
        day: this.attentionDate.format("YYYY-MM-DD"),
        medicalOfficeId: this.medicalOfficeId
      }
    })
  }

}
