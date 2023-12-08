import { Component } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { FormBuilder, Validators } from "@angular/forms"
import { Observable } from "rxjs"

import { GenderEnum } from "../../../core/enums/mat/gender.enum"

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from "../../../exports/lib"

import { DocumentTypeModel } from "src/app/project/models/config/document-type.model"
import { SpecialityModel } from "src/app/project/models/clinic/speciality.model"
import { DoctorModel } from "src/app/project/models/clinic/doctor.model"

@Component({
  selector: "doctor-form",
  templateUrl: "./doctor-form.component.html",
  styleUrls: ["./doctor-form.component.scss"]
})
export class DoctorFormComponent extends AdminCrudForm {

  genderEnum = GenderEnum

  documentTypes$: Observable<Array<DocumentTypeModel>>
  specialities$: Observable<Array<SpecialityModel>>

  documentTypeSelected: DocumentTypeModel
  maskDocumentNumber: string = "00.000.000"

  errorMessages: Array<{ key: string, message: string}> = new Array<{ key: string, message: string}>()

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = DoctorModel

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
      email: ["", Validators.compose([Validators.required, Validators.email])],
      cellphone: ["", Validators.compose([Validators.required])],
      phone: [""],
      address: ["", Validators.compose([Validators.required])],
      collegeDegree: ["", Validators.compose([Validators.required])],
      profession: ["", Validators.compose([Validators.required])],
      rne: [""],
      cmp: [""],
      specialityId: ["", Validators.compose([Validators.required])],
      active: [true],
      createdAt: [""]
    }
  }

  onInit(): void {
    this.documentTypes$ = this.sandboxService.findAll<DocumentTypeModel>(DocumentTypeModel)
    this.specialities$ = this.sandboxService.findAll<SpecialityModel>(SpecialityModel)
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as DoctorModel

    this.formGroup.get("documentNumber").enable()
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as DoctorModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  onDocumentTypeSelected(documentTypeSelected: DocumentTypeModel): void {

    this.documentTypeSelected = documentTypeSelected

    this.maskDocumentNumber = documentTypeSelected.mask

    this.formGroup.get("documentNumber").enable()
    this.formGroup.get("documentNumber").setValue("")
  }

  onValidationError(errors) {
    this.errorMessages = []
    this.errorMessages = errors
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
      case "email":
        return `Correo electrónico`
      case "cellphone":
        return `Teléf. Celular`
      case "address":
        return `Dirección`
      case "collegeDegree":
        return `Título universitario`
      case "profession":
        return `Profesión`
      case "specialityId":
        return `Especialidad`
    }
  }
}
