import { Component, ViewChild } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"
import * as moment from "moment-timezone"
import { ToastrService } from "ngx-toastr"
import { finalize, takeUntil } from "rxjs/operators"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from "../../../exports/lib"

import { SpecialityImportComponent } from "./speciality-import.component"
import { SpecialityFormComponent } from "./speciality-form.component"

import { SpecialityModel } from "src/app/project/models/clinic/speciality.model"
import { SpecialityService } from "src/app/project/services/clinic/speciality.service"

@Component({
  selector: "specialities",
  templateUrl: "./specialities.component.html"
})
export class SpecialitiesListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<SpecialityModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private engineService: SpecialityService,
    private toastr: ToastrService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = SpecialityModel

    this.crudFormClass = SpecialityFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(SpecialityModel, criteria)
  }

  download(): void {
    this.contextService.startLoading()

    const printName: string = `plantilla-especialidades-${moment().format("YYYYMMDDHHmmss")}`

    this.engineService.download().pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.contextService.stopLoading())
    ).subscribe((result: Blob) => handleFile(result, printName))
  }

  import(): void {
    const crudForm = this.setupModal(SpecialityImportComponent, <NgbModalOptions>{
      size: "lg"
    })

    crudForm.onResult.subscribe((result) => {

      this.toastr.success("Carga exitosa", "Hemos realizado la carga de manera exitosa")

      this.onRealTimeUpdate()
    })
  }
}
