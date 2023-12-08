import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"
import { Observable, combineLatest } from "rxjs"

import { GenderEnum } from "../../../core/enums/mat/gender.enum"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { DocumentTypeModel } from "src/app/project/models/config/document-type.model"
import { PatientModel } from "src/app/project/models/clinic/patient.model"

@Component({
  selector: "patient-form",
  templateUrl: "./patient-form.component.html"
})
export class PatientFormComponent extends AdminCrudForm {

  genderEnum = GenderEnum

  documentTypes$: Observable<Array<DocumentTypeModel>>

  documentTypeSelected: DocumentTypeModel
  maskDocumentNumber: string = "00.000.000"

  errorMessages: Array<{ key: string, message: string}> = new Array<{ key: string, message: string}>()

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = PatientModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      firstName: ["", Validators.compose([Validators.required, Validators.pattern(/^[a-z üñÑáéíóúÁÉÍÓÚ]+$/i)])],
      secondName: ["", Validators.compose([Validators.pattern(/^[a-z üñÑáéíóúÁÉÍÓÚ]+$/i)])],
      firstSurname: ["", Validators.compose([Validators.required, Validators.pattern(/^[a-z üñÑáéíóúÁÉÍÓÚ]+$/i)])],
      secondSurname: ["", Validators.compose([Validators.pattern(/^[a-z üñÑáéíóúÁÉÍÓÚ]+$/i)])],
      birthDate: ["", Validators.compose([Validators.required])],
      gender: ["", Validators.compose([Validators.required])],
      documentTypeId: ["", Validators.compose([Validators.required])],
      documentNumber: ["", Validators.compose([Validators.required])],
      emailAddress: ["", Validators.compose([Validators.required, Validators.email])],
      phone: [""],
      cellphone: ["", Validators.compose([Validators.required])],
      addresses: ["", Validators.compose([Validators.required])],
      active: [true],
      historyNumber: [""],
      createdAt: [""]
    }
  }

  onInit(): void {
    this.documentTypes$ = this.sandboxService.findAll<DocumentTypeModel>(DocumentTypeModel)

    combineLatest([
      this.formGroup.get("gender").valueChanges,
      this.formGroup.get("documentNumber").valueChanges
    ]).subscribe(([gender, documentNumber]) => {

      this.formGroup.get("historyNumber").setValue(`${gender}-${documentNumber}`)
    })
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as PatientModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as PatientModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()

    return modelCasted
  }

  onValidationError(errors) {
    this.errorMessages = []
    this.errorMessages = errors
  }

  onDocumentTypeSelected(documentTypeSelected: DocumentTypeModel): void {

    this.documentTypeSelected = documentTypeSelected

    this.maskDocumentNumber = documentTypeSelected.mask

    this.formGroup.get("documentNumber").enable()
    this.formGroup.get("documentNumber").setValue("")
  }


  getAliasFieldByKey(key: string) {

    switch (key) {
      case "firstName":
        return `Primer nombre`
      case "secondName":
        return `Segundo nombre`
      case "firstSurname":
        return `Primer apellido`
      case "secondSurname":
        return `Segundo apellido`
      case "birthDate":
        return `Fecha de nacimiento`
      case "gender":
        return `Sexo`
      case "documentTypeId":
        return `Tipo de documento`
      case "documentNumber":
        return `Nro. documento`
      case "emailAddress":
        return `Correo electrónico`
      case "cellphone":
        return `Teléf. Celular`
      case "addresses":
        return `Dirección`
    }
  }
}
