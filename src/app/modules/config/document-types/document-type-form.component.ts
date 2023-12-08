import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { DocumentTypeModel } from "src/app/project/models/config/document-type.model"

@Component({
  selector: "document-type-form",
  templateUrl: "./document-type-form.component.html"
})
export class DocumentTypeFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = DocumentTypeModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      code: ["", Validators.compose([Validators.required])],
      mask: ["", Validators.compose([Validators.required])],
      createdAt: [""]
    }
  }

  onInit(): void {
    //
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as DocumentTypeModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as DocumentTypeModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }
}
