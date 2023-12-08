import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { CurrencyModel } from "src/app/project/models/ac/currency.model"

@Component({
  selector: "currency-form",
  templateUrl: "./currency-form.component.html"
})
export class CurrencyFormComponent extends AdminCrudForm {


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = CurrencyModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      code: ["", Validators.compose([Validators.required])],
      symbol: ["", Validators.compose([Validators.required])],
      active: [true],
      createdAt: [""]
    }
  }

  onInit(): void {

  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as CurrencyModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as CurrencyModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }
}
