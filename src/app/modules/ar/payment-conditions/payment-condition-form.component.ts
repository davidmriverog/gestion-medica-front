import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { PaymentConditionModel } from "src/app/project/models/ar/payment-condition.model"

@Component({
  selector: "payment-condition-form",
  templateUrl: "./payment-condition-form.component.html"
})
export class PaymentConditionFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = PaymentConditionModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      code: ["", Validators.compose([Validators.required])],
      isCommission: [false],
      percentageCommission: [""],
      active: [true],
      createdAt: [""]
    }
  }

  onInit(): void {
    this.formGroup.get("percentageCommission").disable()

    this.registerUnSubcription(this.formGroup.get("isCommission").valueChanges.subscribe((isCommission) => {
      this.formGroup.get("percentageCommission").setValue(0)

      if (isCommission) {
        this.formGroup.get("percentageCommission").enable()
      } else {
        this.formGroup.get("percentageCommission").disable()
      }
    }))
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as PaymentConditionModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as PaymentConditionModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    modelCasted.active = modelCasted.active != null ? modelCasted.active : true
    return modelCasted
  }
}
