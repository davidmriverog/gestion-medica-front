import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"

import { ToastrService } from "ngx-toastr"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from "../../../exports/lib"

import { MedicalStudentFormComponent } from "./medical-student-form.component"

import { MedicalStudentModel } from "src/app/project/models/clinic/medical-student.model"

@Component({
  selector: "medical-students",
  templateUrl: "./medical-students.component.html"
})
export class MedicalStudentListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<MedicalStudentModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private toastr: ToastrService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = MedicalStudentModel

    this.crudFormClass = MedicalStudentFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(MedicalStudentModel, criteria)
  }
}
