import { Component, ViewChild } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"
import * as moment from "moment-timezone"
import { ToastrService } from "ngx-toastr"
import { finalize, takeUntil } from "rxjs/operators"
import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from "../../../exports/lib"

import { RoleEnum } from "src/app/core/enums/sys/rol-values.enum"
import { GenderEnum } from "src/app/core/enums/mat/gender.enum"

import { PatientFormComponent } from "./patient-form.component"
import { PatientImportComponent } from "./patient-import.component"

import { PatientModel } from "src/app/project/models/clinic/patient.model"
import { PatientService } from "src/app/project/services/clinic/patient.service"

@Component({
  selector: "patients",
  templateUrl: "./patients.component.html"
})
export class PatientListsComponent extends AdminListPage {

  rolesEnum = RoleEnum
  genderEnum = GenderEnum

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<PatientModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private engineService: PatientService,
    private toastr: ToastrService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = PatientModel

    this.crudFormClass = PatientFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(PatientModel, criteria)
  }

  newPatient(): void {

    this.createModal(null, <NgbModalOptions>{
      size: "lg"
    })
  }

  editPatient(row: any): void {

    this.editModal(row, <NgbModalOptions>{
      size: "lg"
    })
  }

  download(): void {
    this.contextService.startLoading()

    const printName: string = `plantilla-pacientes-${moment().format("YYYYMMDDHHmmss")}`

    this.engineService.download().pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.contextService.stopLoading())
    ).subscribe((result: Blob) => handleFile(result, printName))
  }

  import(): void {
    const crudForm = this.setupModal(PatientImportComponent, <NgbModalOptions>{
      size: "lg"
    })

    crudForm.onResult.subscribe((result) => {

      this.toastr.success("Carga exitosa", "Hemos realizado la carga de manera exitosa")

      this.onRealTimeUpdate()
    })
  }
}
