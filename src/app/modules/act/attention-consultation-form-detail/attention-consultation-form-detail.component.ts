import { Component, OnInit } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { shareReplay, switchMap, delay, finalize, tap } from "rxjs/operators"
import * as _ from "lodash"
import * as moment from "moment-timezone"

import { Location } from "@angular/common"
import { PlanningTurnStatusEnum } from "src/app/core/enums/prog/planning-turn-states.enum"
import { ActMedicalService } from "src/app/project/services/act/act-medical.service"
import { SaleService } from "src/app/project/services/ms/sale.service"
import { handleFile } from "src/app/exports/lib"

@Component({
  selector: "attention-consultation-form-detail",
  templateUrl: "./attention-consultation-form-detail.component.html",
  styleUrls: ["./attention-consultation-form-detail.component.scss"]
})
export class AttentionConsultationFormDetailComponent implements OnInit {

  loading: boolean = true
  planningTurnStatusEnum = PlanningTurnStatusEnum


  actMedicalId: string

  actMedical$: Observable<any>

  result: any

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private actMedicalService: ActMedicalService,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {

    this.loading = true

    this.actMedical$ = this.route.params.pipe(
      delay(1000),
      switchMap((param) => {

        return this.actMedicalService.attentionMedicalInfo(param["id"])
      }),
      tap((result) => {
        this.loading = false

        this.result = result
      }),
      shareReplay()
    )


  }

  onAfterViewInit(): void {

  }

  fetchInfoDetail(id: string): void {

    this.loading = true
  }

  redirectToMain(): void {
    this.location.back()
  }

  showAge(date: Date): string {

    const now = moment()

    const diffAge = now.diff(moment(new Date(date)), "years")


    return `${diffAge} Año(s) ${now.format("M")} Mes(es)`
  }

  printPrescription(row: any): void {
    // this.contextService.startLoading()

    Object.assign(row, {
      patient: this.result.planningMedicalCouponTurn.saleDetail.sale.patient,
      doctor: this.result.planningMedicalCouponTurn.planningMedicalTurn.doctor
    })

    const printName: string = `imprimir-receta-${moment().format("YYYYMMDDHHmmss")}`

    this.actMedicalService.printPrescription(row).pipe(
      finalize(() => {
        //
      })
    ).subscribe((result: Blob) => handleFile(result, printName))
  }

}
