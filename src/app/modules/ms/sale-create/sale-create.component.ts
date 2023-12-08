import { Component } from "@angular/core"
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { Observable } from "rxjs"
import { select, Store } from "@ngrx/store"
import { shareReplay, tap } from "rxjs/operators"
import * as _ from "lodash"

import { ActivatedRoute, Router } from "@angular/router"
import Swal from "sweetalert2"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"

import {
  IAppState,
  IContextService,
  validateAllFormFields,
  CoreBaseModel,
  getPeriod,
  checkUser,
  AdminCrudForm,
  SandboxAPIService ,
  getClientInfo, getCurrency
} from "../../../exports/lib"

import { SearchCouponModalComponent } from "./components/search-coupon-modal.component"

import { SaleModel } from "src/app/project/models/sm/sale.model"
import { TaxConditionModel } from "src/app/project/models/sm/tax-condition.model"
import { PaymentConditionModel } from "src/app/project/models/ar/payment-condition.model"

@Component({
  selector: "sale-create",
  templateUrl: "./sale-create.component.html"
})
export class SaleCreateComponent extends AdminCrudForm {

  taxConditions$: Observable<Array<TaxConditionModel>>
  paymentConditions$: Observable<Array<PaymentConditionModel>>

  clientInfo$ = this.store.pipe(
      select(getClientInfo)
  )

  currency$ = this.store.pipe(
      select(getCurrency)
  )

  defaultTaxConditionId: string
  defaultPaymentConditionId: string


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private modalService: NgbModal,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = SaleModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      patientId: ["", Validators.compose([Validators.required])],
      taxConditionId: ["", Validators.compose([Validators.required])],
      paymentConditionId: ["", Validators.compose([Validators.required])],
      subtotal: [0],
      percCommission: [0],
      commission: [0],
      netAmount: [0],
      platformId: [""],
      isPay: [true],
      isAnulated: [false],
      items: this.formBuilder.array([]),
      createdAt: [""]
    }

  }

  onInit() {

    this.taxConditions$ = this.sandboxService.findAll<TaxConditionModel>(TaxConditionModel).pipe(
      tap((results) => {

        if (results.length > 0) {
          this.formGroup.get("taxConditionId").setValue(results[0]._id)

          this.defaultTaxConditionId = results[0]._id
        }
      }),
      shareReplay()
    )

    this.paymentConditions$ = this.sandboxService.findAll<PaymentConditionModel>(PaymentConditionModel).pipe(
      tap((results) => {

        if (results.length > 0) {
          this.formGroup.get("paymentConditionId").setValue(results[0]._id)

          this.defaultPaymentConditionId = results[0]._id
        }
      }),
      shareReplay()
    )

    this.formGroup.get("items").valueChanges.subscribe((items) => {

        let subTotal = 0
        let commision = 0
        let netAmount = 0

        items.map((item) => {
            subTotal += Number(item.amount)
        })

        if (this.formGroup.get("percCommission").value != "" && this.formGroup.get("percCommission").value > 0) {

          commision = subTotal * (this.formGroup.get("percCommission").value / 100)
        }

        netAmount = subTotal + commision

        this.formGroup.patchValue({
            subtotal: subTotal,
            commission: commision,
            netAmount: netAmount
        })

    })
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as SaleModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as SaleModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  removeItem(event: any, index: number): void {
    if (index > -1) {
      (<FormArray>this.formGroup.get("items")).removeAt(index)
    }
  }

  loanCoupons(): void {

    if (this.formGroup.get("patientId").value == "") {
      this.toastr.error("Debe elegir el cliente", "Ops!")
      return
    }

    const paymentGenerateModal = this.modalService.open(SearchCouponModalComponent, <NgbModalOptions>{
      windowClass: "xl-modal",
      backdrop: "static"
    })

    const modalInst = paymentGenerateModal.componentInstance
    modalInst.patientId = this.formGroup.get("patientId").value

    paymentGenerateModal.result.then((selection: Array<any>) => {

      const details = <FormArray>this.formGroup.get("items")

      if (selection.length > 0) {

          selection.map((item) => {

              const isElementInArray = details.value.find((d: any) => d.planningMedicalCouponTurnId === item._id)

              if (!isElementInArray) {

                  details.push(this.formBuilder.group({
                      title: [item.planningMedicalCouponTurnTitle],
                      planningMedicalCouponTurnId: [item.planningMedicalCouponTurnId],
                      specialityName: [item.speciality.name],
                      medicalOfficeName: [item.medicalOffice.officeName],
                      attentionDate: [item.attentionDate],
                      doctorName: [`${item.doctor.firstName} ${item.doctor.firstSurname}`],
                      productId: [item.productId],
                      productName: [item.productName],
                      patientReservationId: [item.patientReservationId],
                      patientName: [item.patientName],
                      amount: [item.price]
                  }))
              }

          })
      }

    }, (reason) => {
        console.log("reason", reason)
    })
  }

  resetForm(): void {

    const details = <FormArray>this.formGroup.get("items")

    details.clear()

    this.formGroup.reset()

    this.formGroup.get("taxConditionId").setValue(this.defaultTaxConditionId)
    this.formGroup.get("paymentConditionId").setValue(this.defaultPaymentConditionId)
  }

  onComissionChange(event: PaymentConditionModel): void {

    if (event) {
      const subtotal = this.formGroup.get("subtotal").value

      if (event.isCommission) {
        const percCommission = event.percentageCommission / 100

        const commission = (percCommission * subtotal)

        const netAmount = commission + subtotal

        this.formGroup.patchValue({
          percCommission: event.percentageCommission,
          subtotal: subtotal,
          commission: commission,
          netAmount: netAmount
        })

      } else {
        this.formGroup.patchValue({
          percCommission: 0,
          subtotal: subtotal,
          commission: 0,
          netAmount: subtotal
        })
      }
    }
  }

  async submit(event: any) {

    try {

      if (this.formGroup.invalid) {

        this.toastr.error("Faltan campos por completar", "Ops!")

        validateAllFormFields(this.formGroup)
        return
      }

      Swal.fire({
        title: `Crear Reserva y/o turno(s)`,
        text: `¿Esta seguro de realizar esta operación?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Reservar",
        cancelButtonText: "No!",
        reverseButtons: true,
        backdrop: true
      }).then(async (result) => {
        if (result.value) {

          const model = Object.assign(new this.modelClass(), this.parseModel(this.formGroup.getRawValue() as CoreBaseModel))
          const modelCasted = this.setMandatoryFields(model)

          this.contextService.startLoading()

          await this.create(modelCasted).then((result) => {

            this.contextService.stopLoading()

            this.resetForm()


          })

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
