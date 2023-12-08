import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { ProductCategoryModel } from "../../../project/models/ar/product-category.model"

@Component({
  selector: "product-category-form",
  templateUrl: "./product-category-form.component.html"
})
export class ProductCategoryFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = ProductCategoryModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      code: ["", Validators.compose([Validators.required])],
      createdAt: [""]
    }
  }

  onInit(): void {

  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as ProductCategoryModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as ProductCategoryModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()

    return modelCasted
  }
}
