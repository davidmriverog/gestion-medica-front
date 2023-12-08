import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { MedicalOfficeModel } from "src/app/project/models/clinic/medical-office.model"

@Component({
  selector: "medical-office-form",
  templateUrl: "./medical-office-form.component.html"
})
export class MedicalOfficeFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = MedicalOfficeModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      officeName: ["", Validators.compose([Validators.required])],
      officeNumber: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      phone: ["", Validators.compose([Validators.required])],
      active: [true],
      createdAt: [""]
    }
  }

  onInit(): void {
    //
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as MedicalOfficeModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as MedicalOfficeModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }
}
