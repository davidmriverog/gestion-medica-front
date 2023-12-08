import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from "../../../exports/lib"

import { MedicineFormComponent } from "./medicine-form.component"

import { MedicineModel } from "src/app/project/models/clinic/medicine.model"

@Component({
  selector: "medicines",
  templateUrl: "./medicines.component.html"
})
export class MedicinesListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<MedicineModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = MedicineModel

    this.crudFormClass = MedicineFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(MedicineModel, criteria)
  }
}
