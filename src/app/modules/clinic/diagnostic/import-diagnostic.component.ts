import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"
import { takeUntil } from "rxjs/operators"

import { AdminCrudForm, CoreBaseModel, IContextService, SandboxAPIService } from "../../../exports/lib"
import { DiagnosticService } from "src/app/project/services/clinic/diagnostic.service"
import { DiagnosticModel } from "src/app/project/models/clinic/diagnostic.model"

@Component({
  selector: "import-diagnostic",
  templateUrl: "./import-diagnostic.component.html"
})
export class ImportDiagnosticComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private engineService: DiagnosticService,
    private toastr: ToastrService,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = DiagnosticModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      file: ["", Validators.compose([Validators.required])],
      createdAt: [""]
    }
  }

  onInit(): void {
    //
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as DiagnosticModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as DiagnosticModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  public async submit(event: any) {

    try {

      this.contextService.startLoading()

      await this.engineService.import(this.formGroup.getRawValue()).pipe(
        takeUntil(this.destroyed$)
      ).subscribe((result) => {

        this.contextService.stopLoading()

        if (this.modal != null) {
          this.modal.close()
        }

        this.onResult.emit(result)
      }, (err) => {

        this.contextService.stopLoading()

        this.toastr.error("Error al cargar el archivo", "Intente mas tarde")
      })
    } catch (e) {

    }
  }
}
