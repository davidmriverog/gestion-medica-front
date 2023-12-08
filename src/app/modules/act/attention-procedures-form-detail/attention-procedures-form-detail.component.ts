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
import { AttentionProceduresDocumentModalComponent } from "./modals/attention-procedures-documents-modal.component"

@Component({
  selector: "attention-procedures-form-detail",
  templateUrl: "./attention-procedures-form-detail.component.html",
  styleUrls: ["./attention-procedures-form-detail.component.scss"]
})
export class AttentionProceduresFormDetailComponent implements OnInit {

  loading: boolean = true
  planningTurnStatusEnum = PlanningTurnStatusEnum


  actMedicalId: string

  actMedical$: Observable<any>

  result: any

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private actMedicalService: ActMedicalService,
    private saleService: SaleService,
    private modalService: NgbModal
  ) { }

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

  loadDetailDocuments(row: any): void {


    const documentModal = this.modalService.open(AttentionProceduresDocumentModalComponent, <NgbModalOptions>{
      windowClass: 'xl-modal',
      backdrop: 'static'
    });

    const crudModal = documentModal.componentInstance;

    crudModal.populate(row);

    documentModal.result.then((selection: any) => {
      //
    }, (reason) => {
      console.log('reason', reason);
    });
  }

}
