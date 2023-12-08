import { Component, ViewChild, ViewEncapsulation, AfterContentInit } from '@angular/core'
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'

import { ActivatedRoute, Router } from '@angular/router'
import Swal from 'sweetalert2'
import * as moment from 'moment-timezone'
import * as _ from 'lodash'


import {
  IAppState,
  IContextService,
  validateAllFormFields,
  CoreBaseModel,
  getPeriod,
  checkUser,
  AdminCrudForm,
  SandboxAPIService ,
  convertUTCDate
} from '../../../exports/lib'

import { PlanningMedicalTurnModel } from "src/app/project/models/prog/planning-medical-turn.model"
import { MedicalOfficeModel } from 'src/app/project/models/clinic/medical-office.model'
import { SpecialityModel } from 'src/app/project/models/clinic/speciality.model'
import { ProductCategoryModel } from 'src/app/project/models/ar/product-category.model'

@Component({
  selector: 'planning-turn-create',
  templateUrl: './planning-turn-create.component.html',
  styleUrls: ['./planning-turn-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlanningTurnCreateComponent extends AdminCrudForm implements AfterContentInit {

  dateStr: moment.Moment
  dayStr: string
  minDate: Date
  maxDate: Date
  medicalOfficeId: string
  accountingPeriodId: string
  productCategoryName: string
  interval: number = 30

  medicalOffice$: Observable<MedicalOfficeModel>
  specialities$: Observable<Array<SpecialityModel>>
  productCategories$: Observable<Array<ProductCategoryModel>>

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = PlanningMedicalTurnModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      accountingPeriodId: [""],
      medicalOfficeId: [""],
      specialityId: [""],
      doctorId: ['', Validators.compose([Validators.required])],
      productCategoryId: ['', Validators.compose([Validators.required])],
      dates:[[]],
      active: [true],
      planningTurnDetails: this.formBuilder.array([]),
      createdAt: [""]
    }

  }

  onInit() {
    this.minDate = moment().startOf("days").toDate()

    this.formGroup.get('specialityId').disable()

    this.specialities$ = this.sandboxService.findAll<SpecialityModel>(SpecialityModel)
    this.productCategories$ = this.sandboxService.findAll<ProductCategoryModel>(ProductCategoryModel)

    this.registerUnSubcription(this.store.pipe(
      select(getPeriod)
    ).subscribe((period) => {

      if (period != null) {
        this.accountingPeriodId = period._id

        this.formGroup.get('accountingPeriodId').setValue(period._id)
      }

    }))

    this.registerUnSubcription(this.route.queryParams.subscribe((param) => {

      this.dateStr = moment(param['day']).startOf('days')
      this.medicalOfficeId = param.medicalOfficeId
      this.dayStr = param['day']

      this.maxDate = moment.utc(param['day']).endOf('months').toDate()

      this.medicalOffice$ = this.sandboxService.findById<MedicalOfficeModel>(MedicalOfficeModel, param['medicalOfficeId'])

      this.formGroup.get('medicalOfficeId').setValue(param['medicalOfficeId'])
    }))

    this.registerUnSubcription(this.formGroup.get('dates').valueChanges.subscribe((dates) => {

      const details = <FormArray>this.formGroup.get('planningTurnDetails')

      if (dates == null || dates.length == 0) {
        details.clear()
      }

      if (dates!= null && dates.length > 0) {


        // añadimos
        dates.forEach((date: Date) => {

          const isElementArray = details.value.find(r => r.date == date.toISOString())

          const attentionStr = moment.utc(date).format("YYYY-MM-DD")

          if (!isElementArray) {
            details.push(this.formBuilder.group({
              date: [date.toISOString(), Validators.compose([Validators.required])],
              attentionDateStr: [attentionStr],
              coupons: this.formBuilder.array([])
            }))
          }

        })

        const ids = details.value.map(r => r.date)

        ids.map((date) => {

          const isRemove = _.includes(dates.map(r => moment(new Date(r)).toDate().toISOString()), date)

          if (!isRemove) {
            this.deletePlanningTurn(date)
          }


        })
      }

    }))

  }

  deletePlanningTurn(date: string): void {

    for (let control of (<FormArray>this.formGroup.get('planningTurnDetails')).controls) {
      if (control instanceof FormGroup) {

        if (moment(control.get('date').value).toDate().toISOString() == date) {

          let index = (<FormArray>this.formGroup.get('planningTurnDetails')).controls.indexOf(control);


          (<FormArray>this.formGroup.get('planningTurnDetails')).removeAt(index)

        }
      }
    }

  }

  onAfterViewInit(): void {

  }

  ngAfterContentInit(): void {
    if (this.dayStr) {
      //
    }
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as PlanningMedicalTurnModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as PlanningMedicalTurnModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  selectDoctor(event: any): void {

    this.formGroup.get('specialityId').setValue(event.specialityId)

    if (event.speciality) {

      this.interval = Number(event.speciality.times)
    }
  }

  onDoctorClear(event: any): void {
    this.formGroup.get('specialityId').reset()
  }

  redirectToMain(): void {

    this.router.navigate(['/prog/reprograming-list-by-date'], {
      queryParams: {
        day: this.dayStr,
        medicalOfficeId: this.medicalOfficeId
      }
    })
  }

  onProductCategorySelected(event: ProductCategoryModel): void {

    this.productCategoryName = event.name
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
        title: `Crear turno(s)`,
        text: `¿Esta seguro de realizar esta operación?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Crear',
        cancelButtonText: 'No!',
        reverseButtons: true,
        backdrop: true
      }).then(async (result) => {
        if (result.value) {

          const model = Object.assign(new this.modelClass(), this.parseModel(this.formGroup.getRawValue() as CoreBaseModel))
          const modelCasted = this.setMandatoryFields(model)

          this.contextService.startLoading()

          await this.create(modelCasted).then((result) => {

             this.redirectToMain()

             this.contextService.stopLoading()
          })

        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {

          Swal.fire(
            'Operación cancelada',
            'has cancelado la operación',
            'error'
          )
        }
      })

    } catch (error) {
      console.log(error)
    }
  }
}
