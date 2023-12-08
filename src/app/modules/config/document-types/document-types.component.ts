import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"

import { ToastrService } from "ngx-toastr"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from "../../../exports/lib"

import { DocumentTypeFormComponent } from "./document-type-form.component"

import { DocumentTypeModel } from "src/app/project/models/config/document-type.model"

@Component({
  selector: "document-types",
  templateUrl: "./document-types.component.html"
})
export class DocumentTypeListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<DocumentTypeModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private toastr: ToastrService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = DocumentTypeModel

    this.crudFormClass = DocumentTypeFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(DocumentTypeModel, criteria)
  }
}
