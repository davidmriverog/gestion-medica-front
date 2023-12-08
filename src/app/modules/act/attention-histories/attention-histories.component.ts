import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"

import { ToastrService } from "ngx-toastr"

import { Router } from "@angular/router"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from "../../../exports/lib"

import { SaleService } from "src/app/project/services/ms/sale.service"
import { PlanningMedicalCouponTurnModel } from "src/app/project/models/prog/planning-medical-coupon-turn.model"
import { PlanningTurnStatusEnum } from "src/app/core/enums/prog/planning-turn-states.enum"
import { PlanningMedicalCouponTurnService } from "src/app/project/services/prog/planning-medical-coupon-turn.service"

@Component({
  selector: "attention-histories",
  templateUrl: "./attention-histories.component.html"
})
export class AttentionHistoriesComponent extends AdminListPage {

  planningTurnStatusEnum = PlanningTurnStatusEnum

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<any[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private saleService: SaleService,
    private toastr: ToastrService,
    private router: Router,
    private planningCouponTurn: PlanningMedicalCouponTurnService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = PlanningMedicalCouponTurnModel
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.planningCouponTurn.listPaginateHistory(criteria)
  }

  goAttentionFormDetail(row: any): void {

    // if (row.planningMedicalTurn.productCategoryId == "604ffcfe2df1660a7013c29c") { // consulta
    //     this.router.navigate(['/act/attention-consultation-form-detail', row.detail.medicalActId]);
    // }

    // if (row.planningMedicalTurn.productCategoryId == "604ffd2c2df1660a7013c29d") { // procedimiento
    //     this.router.navigate(['/act/attention-procedures-form-detail', row.detail.medicalActId]);
    // }
  }

}
