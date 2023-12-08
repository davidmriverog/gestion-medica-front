import { Component, ViewChild } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"
import * as moment from "moment-timezone"
import { ToastrService } from "ngx-toastr"
import { finalize, takeUntil } from "rxjs/operators"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from "../../../exports/lib"

import { DiagnosticFormComponent } from "./diagnostic-form.component"

import { DiagnosticService } from "src/app/project/services/clinic/diagnostic.service"

import { DiagnosticModel } from "src/app/project/models/clinic/diagnostic.model"
import { ImportDiagnosticComponent } from "./import-diagnostic.component"

@Component({
  selector: "diagnostics",
  templateUrl: "./diagnostics.component.html"
})
export class DiagnosticsListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<DiagnosticModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private engineService: DiagnosticService,
    private toastr: ToastrService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = DiagnosticModel

    this.crudFormClass = DiagnosticFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(DiagnosticModel, criteria)
  }

  download(): void {
    this.contextService.startLoading()

    const printName: string = `plantilla-diagnostico-cie-10-${moment().format("YYYYMMDDHHmmss")}`

    this.engineService.download().pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.contextService.stopLoading())
    ).subscribe((result: Blob) => handleFile(result, printName))

  }

  import(): void {
    const crudForm = this.setupModal(ImportDiagnosticComponent, <NgbModalOptions>{
      size: "lg"
    })

    crudForm.onResult.subscribe((result) => {

      this.toastr.success("Carga exitosa", "Hemos realizado la carga de manera exitosa")

      this.onRealTimeUpdate()
    })
  }
}
