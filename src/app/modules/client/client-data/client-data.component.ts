import { Component, Renderer2 } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from "@angular/common"
import { Store } from "@ngrx/store"
import { Observable, of } from "rxjs"
import { finalize } from "rxjs/operators"
import { ToastrService } from "ngx-toastr"

import { IAppState, IContextService, LoginFormCore, validateAllFormFields, AuthService } from "../../../exports/lib"
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from "ng-wizard"

import { GenderEnum } from "src/app/core/enums/mat/gender.enum"
import { DocumentTypeModel } from "src/app/project/models/config/document-type.model"

@Component({
  selector: "client-data",
  templateUrl: "./client-data.component.html",
  styleUrls: ["./client-data.component.scss"]
})
export class ClientDataComponent extends LoginFormCore {

  formGroup: FormGroup

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  }

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.circles,
    toolbarSettings: {
      showNextButton: false,
      showPreviousButton: false,
      toolbarExtraButtons: []
    }
  }

  stepMessage: string = ""
  currentStep: number = 0

  documentTypes$: Observable<Array<DocumentTypeModel>>

  documentTypeSelected: DocumentTypeModel
  maskDocumentNumber: string = "00.000.000"
  genderEnum = GenderEnum

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private renderer: Renderer2,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private ngWizardService: NgWizardService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    super(router, formBuilder, location)

    this.controls = {
      firstName: ["", Validators.compose([Validators.required])],
      secondName: [""],
      firstSurname: ["", Validators.compose([Validators.required])],
      secondSurname: [""],
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
      createdAt: [""],
      username: ["", Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])]
    }

  }

  onInit(): void {

  }

  onDestroy(): void {

  }

  onSubmit(): void {

    //
  }


  showPreviousStep(event?: Event) {

    if (this.currentStep != 0) {
      this.ngWizardService.previous()
    }
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next()
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset()
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme)
  }

  stepChanged(args: StepChangedArgs) {
    this.currentStep = args.step.index

    switch (this.currentStep) {

      case 0:
        this.stepMessage = "Datos personales"


        break

      case 1:

        this.stepMessage = "Identidad personal"


        break


        break

    }

  }

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true)
  }

  onDocumentTypeSelected(documentTypeSelected: DocumentTypeModel): void {

    this.documentTypeSelected = documentTypeSelected

    this.maskDocumentNumber = documentTypeSelected.mask

    this.formGroup.get("documentNumber").enable()
    this.formGroup.get("documentNumber").setValue("")
  }

  async submit(event: any) {

    try {

      if (this.formGroup.invalid) {
        validateAllFormFields(this.formGroup)
        return
      }

      this.contextService.startLoading()

      await this.authService.newUserRegister(this.formGroup.getRawValue()).pipe(
        finalize(() => {
          this.contextService.stopLoading()
        })
      ).subscribe((results) => {

        if (results) {
          this.toastService.success("Ya eres miembro de nuestra plataforma...", "Felicidades!")
          this.router.navigate(["/login"])
        }
      })


    } catch (error) {

    }
  }

}
