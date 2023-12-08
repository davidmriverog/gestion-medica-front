import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"
import { select, Store } from "@ngrx/store"

import { operationTypeLists } from "../../../core/enums/ac/operation-type.enum"
import { AdminCrudForm, CoreBaseModel, getPeriod, IAppState, SandboxAPIService } from "../../../exports/lib"

import { MovementModel } from "../../../project/models/ac/movement.model"

@Component({
  selector: "movement-form",
  templateUrl: "./movement-form.component.html"
})
export class MovementFormComponent extends AdminCrudForm {

  operationTypes = operationTypeLists

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private store: Store<IAppState>,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = MovementModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      accountingPeriodId: ["", Validators.compose([Validators.required])],
      movementCode: [""],
      transactionOperationCode: ["", Validators.compose([Validators.required])],
      transactionOperationRefId: [""],
      type: ["", Validators.compose([Validators.required])],
      concept: ["", Validators.compose([Validators.required])],
      amount: ["", Validators.compose([Validators.required])],
      createdAt: [""]
    }
  }

  onInit(): void {
    this.registerUnSubcription(this.store.pipe(
      select(getPeriod)
    ).subscribe((period) => {

      if (period != null) {
        this.formGroup.get("accountingPeriodId").setValue(period._id)
      } else {
        this.modal.close()

        this.toastr.error("No hay un periodo contable en curso", "Ops!")
      }
    }))
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as MovementModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as MovementModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }
}
