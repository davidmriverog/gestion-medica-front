import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"
import { PatientAffectionModel } from "src/app/project/models/clinic/patient-affection.model"


@Component({
  selector: "profile-patient-affection-form",
  templateUrl: "./profile-patient-affection-form.component.html"
})
export class ProfilePatientAffectionFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = PatientAffectionModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      description: [""],
      patientId: [""],
      createdAt: [""],
    }
  }

  onInit(): void {
    //
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as PatientAffectionModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as PatientAffectionModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }
}
