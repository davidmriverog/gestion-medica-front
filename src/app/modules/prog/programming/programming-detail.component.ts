import { Component, OnInit } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { shareReplay, switchMap, delay, finalize } from "rxjs/operators"
import * as _ from "lodash"
import * as moment from "moment-timezone"
import Swal from "sweetalert2"
import { ToastrService } from "ngx-toastr"

import { IContextService, IOptionList, handleFile, FilterTypesEnum, SandboxAPIService } from "../../../exports/lib"

import { ReprogrammingModalComponent } from "../reprogramming/reprogramming-modal.component"

import { PlanningTurnStatusEnum } from "../../../core/enums/prog/planning-turn-states.enum"
import { PlanningMedicalTurnService } from "../../../project/services/prog/planning-medical-turn.service"
import { PlanningMedicalCouponTurnService } from "../../../project/services/prog/planning-medical-coupon-turn.service"

import { PlanningMedicalTurnModel } from "../../../project/models/prog/planning-medical-turn.model"
import { ProductCategoryEnum } from "src/app/core/enums/ar/product-category.enum"

@Component({
  selector: "programming-detail",
  templateUrl: "./programming-detail.component.html"
})
export class PlanningMedicalTurnDetailComponent implements OnInit {

  loading: boolean = true
  planningTurnStatusEnum = PlanningTurnStatusEnum

  programmigMedicalTurnId: string
  productCategoryId: string

  programmingTurnResult$: Observable<any>

  dateStr: moment.Moment
  dayStr: string
  medicalOfficeId: string
  specialityId: string
  doctorId: string

  coupons: Array<any>

  planningTurn: any

  constructor(
    private sandboxService: SandboxAPIService,
    private modalServies: NgbModal,
    private engineService: PlanningMedicalTurnService,
    private contextService: IContextService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private planningTurnCouponService: PlanningMedicalCouponTurnService
  ) {

  }

  ngOnInit(): void {

    this.route.params.subscribe((param) => {

      this.programmigMedicalTurnId = param["id"]

      this.loadPrommamingMedicalTurn()
    })

    this.route.queryParams.subscribe((param) => {

      this.dateStr = moment(param["day"]).startOf("days")
      this.medicalOfficeId = param.medicalOfficeId
      this.dayStr = param["day"]
    })
  }

  onAfterViewInit(): void {

  }

  redirectToMain(): void {
    this.router.navigate(["/prog/reprograming-list-by-date"], {
      queryParams: {
        day: this.dayStr,
        medicalOfficeId: this.medicalOfficeId
      }
    })
  }

  loadPrommamingMedicalTurn(): void {

    this.loading = true

    this.engineService.findByProgrammingDetail(this.programmigMedicalTurnId).pipe(
      finalize(() => {
        this.loading = false
      }),
      shareReplay()
    ).subscribe((result) => {

      this.planningTurn = result

      this.doctorId = result.doctorId
      this.productCategoryId = result.productCategoryId

      this.specialityId = result.specialityId



      const couponSorts = _.sortBy(result.coupons, (r) => {
        const startHour = moment(new Date(this.dayStr))
          .set("hours", r.start.toString().substring(0, 2))
          .set("minutes", r.start.toString().substring(3, 5))
          .set("seconds", 0)

        const endtHour = moment(new Date(this.dayStr))
          .set("hours", r.end.toString().substring(0, 2))
          .set("minutes", r.end.toString().substring(3, 5))
          .set("seconds", 0)

        return [startHour, endtHour]
      })

      this.coupons = couponSorts


      this.programmingTurnResult$ = of(result)
    })
  }

  confirmReprogramming(planningMedicalCouponTurnId: string, saleDetailId: string, row: any): void {

    const titleMessage: string = `Reprogramar cita al día ${moment(new Date(row.attentionDate)).format("DD-MM-YYYY")} hora ${row.start} médico ${row.doctor.firstName} ${row.doctorFullName} consultorio ${row.medicalOffice.officeName}`
    const contentMessage: string = `¿Esta seguro de realizar esta operación?, Una vez hecha esta operación no se podrá revertir.`

    Swal.fire({
      title: titleMessage,
      text: contentMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Si, Reprogramar.`,
      cancelButtonText: "No!",
      reverseButtons: true,
      backdrop: true
    }).then((result) => {
      if (result.value) {

        this.contextService.startLoading()

        this.planningTurnCouponService.reProgrammingMedicalTurn({
          saleDetailId: saleDetailId,
          from: planningMedicalCouponTurnId,
          to: row.planningMedicalCouponTurnId
        }).subscribe((response) => {

          Swal.fire(
            "Éxito",
            "Proceso realizado exitosamente",
            "success"
          )

          this.loadPrommamingMedicalTurn()

          this.contextService.stopLoading()
        }, (err) => {
          this.toastr.error("Ha ocurrido un error, intente más tarde.", "Error")
          this.contextService.stopLoading()
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

  modalReprogramming(planningMedicalCouponTurnId: string, saleDetailId: string): void {

    const modalReprogrammingTurn = this.modalService.open(ReprogrammingModalComponent, <NgbModalOptions>{
      windowClass: "xl-modal",
      backdrop: "static"
    })

    // inject
    modalReprogrammingTurn.componentInstance.doctorId = this.doctorId
    modalReprogrammingTurn.componentInstance.planningMedicalCouponTurnId = planningMedicalCouponTurnId
    modalReprogrammingTurn.componentInstance.saleDetailId = saleDetailId
    modalReprogrammingTurn.componentInstance.productCategoryId = this.productCategoryId
    modalReprogrammingTurn.componentInstance.specialityId = this.specialityId

    modalReprogrammingTurn.result.then((selection: any) => {

      if (selection != null) {
        this.confirmReprogramming(planningMedicalCouponTurnId, saleDetailId, selection)
      }
    }, (reason) => {
      console.log("reason", reason)
    })
  }

  deleteProgramming(): void {
    const couponReservated = _.filter(this.coupons, (r) => r.planningTurnStatus.code == PlanningTurnStatusEnum.PendingAttention || (r.saleDetail != null && r.saleDetail.patientReservation != null))
    const couponAttended = _.filter(this.coupons, (r) => r.planningTurnStatus.code == PlanningTurnStatusEnum.Attended)

    if (couponAttended.length > 0) {
      this.toastr.error("No se puede anular programaciones con cupos ya atendidos!", "Atención!", {
        extendedTimeOut: 4000
      })
      return
    }

    if (couponReservated.length > 0) {
      this.toastr.error("No se puede anular programación con cupos aún reservados, por favor reprogramelos", "Atención!", {
        extendedTimeOut: 4000
      })
      return
    }

    Swal.fire({
      title: "Anular programación",
      text: "¿Esta seguro de realizar esta operación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Si, Anular.`,
      cancelButtonText: "No!",
      reverseButtons: true,
      backdrop: true
    }).then((result) => {

      if (result.value) {
        this.contextService.startLoading()

        this.sandboxService.delete<PlanningMedicalTurnModel>(PlanningMedicalTurnModel, this.programmigMedicalTurnId).subscribe((result) => {

          this.contextService.stopLoading()

          this.toastr.success("Programación anulada exitosamente", "Proceso exitoso!")

          this.redirectToMain()

        })

      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire(
          "Operación cancelada",
          "has cancelado la operación",
          "error"
        )
      }
    })
  }

  goAttentionFormDetail(row: any): void {

    switch (this.planningTurn.productCategory.code) {
      case ProductCategoryEnum.CONS:

        this.router.navigate(["/act/attention-consultation-form-detail", row.saleDetail.medicalActId])
        break
      case ProductCategoryEnum.PROC:

        this.router.navigate(["/act/attention-procedure-form-detail", row.saleDetail.medicalActId])
        break
    }
  }
}
