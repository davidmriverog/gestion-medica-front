import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"
import { takeUntil } from "rxjs/operators"

import { AdminCrudForm, CoreBaseModel, IContextService, SandboxAPIService } from "../../../exports/lib"

import { DoctorService } from "src/app/project/services/clinic/doctor.service"
import { DoctorModel } from "src/app/project/models/clinic/doctor.model"

@Component({
  selector: "doctor-import",
  templateUrl: "./doctor-import.component.html"
})
export class DoctorImportComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private engineService: DoctorService,
    private toastr: ToastrService,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = DoctorModel

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
    const modelCasted = model as DoctorModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as DoctorModel
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
