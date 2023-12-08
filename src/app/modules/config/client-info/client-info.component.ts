import { Component } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { Router } from "@angular/router"
import { Observable } from "rxjs"
import Swal from "sweetalert2"
import { select, Store } from "@ngrx/store"

import { IAppState, IContextService, validateAllFormFields, CoreBaseModel, getClientInfo, checkUser, AdminCrudForm, SandboxAPIService } from "../../../exports/lib"

import { CurrencyModel } from "src/app/project/models/ac/currency.model"
import { ClientInfoModel } from "src/app/project/models/config/client-info.model"


@Component({
  selector: "client-info",
  templateUrl: "./client-info.component.html",
  styleUrls: ["./client-info.component.scss"]
})
export class ClientInfoComponent extends AdminCrudForm {

  currencies$: Observable<Array<CurrencyModel>>

  public activeTab: string

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = ClientInfoModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      businessName: ["", Validators.compose([Validators.required])],
      businessNumber: ["", Validators.compose([Validators.required])],
      legalRepresentative: ["", Validators.compose([Validators.required])],
      countryName: ["", Validators.compose([Validators.required])],
      currencyId: ["", Validators.compose([Validators.required])],
      taxeName: ["", Validators.compose([Validators.required])],
      taxeValue: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      phoneOne: ["", Validators.compose([Validators.required])],
      phoneTwo: [""],
      logoImg: [null],
      address: ["", Validators.compose([Validators.required])],
      active: [true],
      createdAt: [""]
    }

  }

  onInit() {
    this.activeTab = "personal-data"

    this.currencies$ = this.sandboxService.findAll<CurrencyModel>(CurrencyModel)

    this.registerUnSubcription(this.store.pipe(
      select(getClientInfo)
    ).subscribe((clientInfo) => {

      if (clientInfo != null) {
        this.populate(clientInfo)
      }
    }))
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as ClientInfoModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as ClientInfoModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  async submit(event: any) {

    try {

      if (this.formGroup.invalid) {

        this.formGroup.markAsTouched();
        this.updateFormValueAndValidityRecursively(this.formGroup)

        this.toastr.error("Faltan campos por completar", "Ops!")
        return
      }

      Swal.fire({
        title: `Actualizar datos`,
        text: `¿Esta seguro de realizar esta operación?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Actualizar",
        cancelButtonText: "No!",
        reverseButtons: true,
        backdrop: true
      }).then(async (result) => {
        if (result.value) {

          const model = Object.assign(new this.modelClass(), this.parseModel(this.formGroup.getRawValue() as CoreBaseModel))
          const modelCasted = this.setMandatoryFields(model)

          const id = model.getIdentity()

          if (id && id != "") { // Update
            await this.update(modelCasted).then((result) => {
              this.store.dispatch(checkUser())
            })
          } else { // Create

            await this.create(modelCasted).then((result) => {
              this.store.dispatch(checkUser())
            })
          }

        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {

          Swal.fire(
            "Operación cancelada",
            "has cancelado la operación",
            "error"
          )
        }
      })

    } catch (error) {
      console.log(error)
    }
  }
}
