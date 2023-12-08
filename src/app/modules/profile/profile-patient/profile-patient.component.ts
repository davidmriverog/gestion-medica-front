import { Component, ViewChild, ViewEncapsulation, AfterContentInit } from "@angular/core"
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { Observable, Unsubscribable } from "rxjs"
import { select, Store } from "@ngrx/store"
import Swal from "sweetalert2"
import * as _ from "lodash"
import { first, shareReplay } from "rxjs/operators"

import { ActivatedRoute, Router } from "@angular/router"

import {
  IAppState,
  IContextService,
  validateAllFormFields,
  CoreBaseModel,
  AdminCrudForm,
  SandboxAPIService,
  getUserPatient,
  checkUser,
  IApiCriteria,
  IAPIRecords,
  UIAdminTableComponent
} from "../../../exports/lib"

import * as moment from "moment-timezone"

import { PlanningMedicalTurnModel } from "src/app/project/models/prog/planning-medical-turn.model"
import { GenderEnum } from "src/app/core/enums/mat/gender.enum"
import { DocumentTypeModel } from "src/app/project/models/config/document-type.model"
import { PatientModel } from "src/app/project/models/clinic/patient.model"
import { PatientAffectionModel } from "src/app/project/models/clinic/patient-affection.model"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { ProfilePatientAffectionFormComponent } from "./profile-patient-affection-form.component"

@Component({
  selector: "profile-patient",
  templateUrl: "./profile-patient.component.html",
  encapsulation: ViewEncapsulation.None
})
export class ProfilePatientComponent extends AdminCrudForm {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

  genderEnum = GenderEnum

  documentTypes$: Observable<Array<DocumentTypeModel>>

  documentTypeSelected: DocumentTypeModel
  maskDocumentNumber: string = "00.000.000"

  patientUser$: Observable<any> = this.store.pipe(
    select(getUserPatient)
  );

  maxDate: Date

  records$: Observable<IAPIRecords<PatientAffectionModel[]>>

  patientId: string

  patientUnsubScribable$: Unsubscribable

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private sandboxService: SandboxAPIService,
    private modalService: NgbModal
  ) {
    super(formBuilder, toastr, sandboxService, modalService)
    this.modelClass = PatientModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      firstName: ["", Validators.compose([Validators.required])],
      secondName: [""],
      firstSurname: ["", Validators.compose([Validators.required])],
      secondSurname: [""],
      birthDate: ["", Validators.compose([Validators.required])],
      gender: ["", Validators.compose([Validators.required])],
      emailAddress: ["", Validators.compose([Validators.required, Validators.email])],
      phone: [""],
      documentTypeId: ["", Validators.compose([Validators.required])],
      documentNumber: ["", Validators.compose([Validators.required])],
      cellphone: ["", Validators.compose([Validators.required])],
      addresses: ["", Validators.compose([Validators.required])],
      historyNumber: [""],
      active: [""],
    }

  }

  onInit() {
    this.maxDate = new Date()

    this.documentTypes$ = this.sandboxService.findAll<DocumentTypeModel>(DocumentTypeModel)

    this.patientUnsubScribable$ = this.patientUser$.pipe(
      first(),
      shareReplay()
    ).subscribe((patient) => {

      this.patientId = patient._id

      this.populate(patient)
    })
  }


  newAffectionPatient(): void {

    const crudForm = this.setupModal(ProfilePatientAffectionFormComponent, <NgbModalOptions> {
      size: "lg"
    });

    crudForm.populate(<PatientAffectionModel>{
      patientId: this.patientId
    })

    this._onResultSubcription = crudForm.onResult.subscribe((result) => {
      this.onRealTimeUpdate()
    });

  }

  editAffectionPatient(row: any): void {

    const crudForm = this.setupModal(ProfilePatientAffectionFormComponent, <NgbModalOptions> {
      size: "lg"
    });

    crudForm.populate(row)

    this._onResultSubcription = crudForm.onResult.subscribe((result) => {
      this.onRealTimeUpdate()
    });

  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onDestroy(): void {

    if (this.patientUnsubScribable$) {
      this.patientUnsubScribable$.unsubscribe()
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

  onDocumentTypeSelected(documentTypeSelected: DocumentTypeModel): void {

    this.documentTypeSelected = documentTypeSelected

    this.maskDocumentNumber = documentTypeSelected.mask

    this.formGroup.get("documentNumber").enable()
    this.formGroup.get("documentNumber").setValue("")
  }

  onRefresh(criteria: IApiCriteria) {

    this.records$ = this.sandboxService.listPage(PatientAffectionModel, criteria)
  }

  editAffection(row: any) {
    //
  }

  async submit(event: any) {

    try {

      if (this.formGroup.invalid) {

        this.toastr.error("Faltan campos por completar", "Ops!")

        validateAllFormFields(this.formGroup)
        return
      }

      Swal.fire({
        title: `Modificar perfil`,
        text: `¿Esta seguro de realizar esta operación?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Modificar",
        cancelButtonText: "No!",
        reverseButtons: true,
        backdrop: true
      }).then(async (result) => {
        if (result.value) {

          const model = Object.assign(new this.modelClass(), this.parseModel(this.formGroup.getRawValue() as CoreBaseModel))
          const modelCasted = this.setMandatoryFields(model)

          this.contextService.startLoading()

          await this.update(modelCasted).then((result) => {

             this.contextService.stopLoading()

             this.store.dispatch(checkUser())
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
