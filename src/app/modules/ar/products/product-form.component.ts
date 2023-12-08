import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { Observable } from "rxjs"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { SpecialityModel } from "src/app/project/models/clinic/speciality.model"
import { ProductCategoryModel } from "src/app/project/models/ar/product-category.model"
import { ProductModel } from "src/app/project/models/ar/product.model"

@Component({
  selector: "product-form",
  templateUrl: "./product-form.component.html"
})
export class ProductFormComponent extends AdminCrudForm {

  specialities$: Observable<Array<SpecialityModel>>
  productCategories$: Observable<Array<ProductCategoryModel>>

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = ProductModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      price: ["", Validators.compose([Validators.required])],
      specialityId: ["", Validators.compose([Validators.required])],
      productCategoryId: ["", Validators.compose([Validators.required])],
      createdAt: [""]
    }
  }

  onInit(): void {
    this.specialities$ = this.sandboxService.findAll<SpecialityModel>(SpecialityModel)
    this.productCategories$ = this.sandboxService.findAll<ProductCategoryModel>(ProductCategoryModel)
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as ProductModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as ProductModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }
}
