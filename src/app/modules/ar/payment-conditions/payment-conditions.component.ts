import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from "../../../exports/lib"

import { PaymentConditionFormComponent } from "./payment-condition-form.component"

import { PaymentConditionModel } from "src/app/project/models/ar/payment-condition.model"

@Component({
  selector: "payment-conditions",
  templateUrl: "./payment-conditions.component.html"
})
export class PaymentConditionsComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<PaymentConditionModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = PaymentConditionModel

    this.crudFormClass = PaymentConditionFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(PaymentConditionModel, criteria)
  }
}
