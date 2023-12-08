import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { MedicineModel } from "src/app/project/models/clinic/medicine.model"

@Component({
  selector: "medicine-form",
  templateUrl: "./medicine-form.component.html"
})
export class MedicineFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = MedicineModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      code: ["", Validators.compose([Validators.required])],
      concentration: ["", Validators.compose([Validators.required])],
      description: [""],
      createdAt: [""]
    }
  }

  onInit(): void {
    //
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as MedicineModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as MedicineModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }
}
