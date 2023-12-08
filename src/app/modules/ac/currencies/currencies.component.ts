import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from "../../../exports/lib"

import { CurrencyFormComponent } from "./currency-form.component"

import { CurrencyModel } from "src/app/project/models/ac/currency.model"

@Component({
  selector: "currencies",
  templateUrl: "./currencies.component.html"
})
export class CurrenciesComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<CurrencyModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = CurrencyModel

    this.crudFormClass = CurrencyFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {

    this.records$ = this.sandboxService.listPage(CurrencyModel, criteria)
  }
}
