import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"
import { OperationTypeEnum } from "src/app/core/enums/ac/operation-type.enum"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from "../../../exports/lib"

import { MovementFormComponent } from "./movement-form.component"

import { MovementModel } from "src/app/project/models/ac/movement.model"

@Component({
  selector: "movements",
  templateUrl: "./movements.component.html"
})
export class MovementListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<MovementModel[]>>

  operationTypeEnum = OperationTypeEnum

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = MovementModel

    this.crudFormClass = MovementFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(MovementModel, criteria)
  }
}
