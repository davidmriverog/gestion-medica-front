import { Component, ViewChild } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"
import { Store } from "@ngrx/store"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, IAppState, checkUser } from "../../../exports/lib"

import { AccountingPeriodFormComponent } from "./accounting-period-form.component"

import { AccountingPeriodModel } from "src/app/project/models/ac/accounting-period.model"

@Component({
  selector: "accounting-periods",
  templateUrl: "./accounting-periods.component.html"
})
export class AccountingPeriodListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<AccountingPeriodModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private store: Store<IAppState>
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = AccountingPeriodModel

    this.crudFormClass = AccountingPeriodFormComponent
  }

  onInit(): void {
    //
  }

  editAccount(row: any): void {

    this.editModal(row, <NgbModalOptions>{
      size: "lg"
    })
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
    this.store.dispatch(checkUser())
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(AccountingPeriodModel, criteria)
  }
}
