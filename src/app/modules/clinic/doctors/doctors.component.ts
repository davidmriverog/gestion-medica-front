import { Component, ViewChild } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"
import * as moment from "moment-timezone"
import { ToastrService } from "ngx-toastr"
import { finalize, takeUntil } from "rxjs/operators"
import { GenderEnum } from "src/app/core/enums/mat/gender.enum"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from "../../../exports/lib"

import { DoctorImportComponent } from "./doctor-import.component"
import { DoctorFormComponent } from "./doctor-form.component"

import { DoctorModel } from "src/app/project/models/clinic/doctor.model"
import { DoctorService } from "src/app/project/services/clinic/doctor.service"

@Component({
  selector: "doctors",
  templateUrl: "./doctors.component.html"
})
export class DoctorListsComponent extends AdminListPage {

  genderEnum = GenderEnum

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<DoctorModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private engineService: DoctorService,
    private toastr: ToastrService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = DoctorModel

    this.crudFormClass = DoctorFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(DoctorModel, criteria)
  }

  newDoctor(): void {

    this.createModal(null, <NgbModalOptions>{
      size: "lg"
    })
  }

  editDoctor(row: any): void {

    this.editModal(row, <NgbModalOptions>{
      size: "lg"
    })
  }

  download(): void {
    this.contextService.startLoading()

    const printName: string = `plantilla-medicos-${moment().format("YYYYMMDDHHmmss")}`

    this.engineService.download().pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.contextService.stopLoading())
    ).subscribe((result: Blob) => handleFile(result, printName))

  }

  import(): void {
    const crudForm = this.setupModal(DoctorImportComponent, <NgbModalOptions>{
      size: "lg"
    })

    crudForm.onResult.subscribe((result) => {

      this.toastr.success("Carga exitosa", "Hemos realizado la carga de manera exitosa")

      this.onRealTimeUpdate()
    })
  }
}
