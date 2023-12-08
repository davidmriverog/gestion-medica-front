import { Observable } from "rxjs"
import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { AccountingPeriodService } from "../../../project/services/ac/accounting-period.service"

import { AccountingPeriodModel } from "../../../project/models/ac/accounting-period.model"

@Component({
  selector: "accounting-period-form",
  templateUrl: "./accounting-period-form.component.html"
})
export class AccountingPeriodFormComponent extends AdminCrudForm {

  accountingPeriodParents$: Observable<Array<AccountingPeriodModel>>

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService,
    private accountingPeriodService: AccountingPeriodService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = AccountingPeriodModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      name: ["", Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      initBalance: ["", Validators.compose([Validators.required])],
      accountingPeriodParentId: [null],
      observation: [""],
      isOpened: [true],
      createdAt: [""]
    }
  }

  onInit(): void {
    this.accountingPeriodParents$ = this.accountingPeriodService.accountingPeriodClosing()

    this.formGroup.get("startDate").disable()
    this.formGroup.get("endDate").disable()

    this.formGroup.get("initBalance").disable()
    this.formGroup.get("accountingPeriodParentId").disable()
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as AccountingPeriodModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as AccountingPeriodModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  changeAccountingPeriod(event: any): void {

    this.formGroup.get("initBalance").setValue(event.accountingPeriodBalance.balance, {
      eventEmmit: false
    })
  }
}
