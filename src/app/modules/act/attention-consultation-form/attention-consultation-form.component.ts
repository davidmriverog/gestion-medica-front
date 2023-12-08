import { AfterContentInit, Component, ViewChild, ViewEncapsulation } from "@angular/core"
import { ToastrService } from "ngx-toastr"
import { Router, ActivatedRoute } from "@angular/router"
import { Observable, of, combineLatest } from "rxjs"
import { shareReplay, switchMap, delay, finalize, tap } from "rxjs/operators"
import Swal from "sweetalert2"
import { Store } from "@ngrx/store"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { FormBuilder, Validators, FormArray } from "@angular/forms"
import * as moment from "moment-timezone"

import { IAppState, IContextService, validateAllFormFields, CoreBaseModel, AdminCrudForm, SandboxAPIService, handleFile, IAPIRecords, UIAdminTableComponent, IApiCriteria, IFilterCriterion, FilterTypesEnum, FilterTypeValue } from "../../../exports/lib"
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from "ng-wizard"

import { ImportDiagnosticModalComponent } from "../modals/import-diagnostic-modal/import-diagnostic-modal.component"
import { PrescriptionFormModalComponent } from "../modals/import-prescription-modal/import-prescription-modal.component"

import { SaleDetailService } from "../../../project/services/ms/sale-detail.service"
import { ActMedicalService } from "../../../project/services/act/act-medical.service"
import { ActMedicalModel } from "src/app/project/models/act/act-medical.model"
import { ProfilePatientAffectionFormComponent } from "../../profile/profile-patient/profile-patient-affection-form.component"
import { PatientAffectionModel } from "src/app/project/models/clinic/patient-affection.model"

@Component({
  selector: "attention-consultation-form",
  templateUrl: "./attention-consultation-form.component.html",
  styleUrls: ["./attention-consultation-form.component.scss"],
  // encapsulation: ViewEncapsulation.None
})
export class AttentionConsultationFormComponent extends AdminCrudForm implements AfterContentInit {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

  detailInfo$: Observable<any>

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

  patientId: string
  patient: any

  doctor: any

  classOxigeno: string
  classIMC: string

  answerConstrols: Array<{ id: string, name: string }> = [
    { id: "YES", name: "Si" },
    { id: "NO", name: "No" }
  ]

  records$: Observable<IAPIRecords<PatientAffectionModel[]>>

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private sandboxService: SandboxAPIService,
    private saleDetailService: SaleDetailService,
    private ngWizardService: NgWizardService,
    private modalService: NgbModal,
    private actMedicalService: ActMedicalService
  ) {
    super(formBuilder, toastr, sandboxService, modalService)
    this.modelClass = ActMedicalModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      type: ["CONS"],
      ananmesis: ["", Validators.compose([Validators.required])],
      medicalReport: [null],
      isPregnant: [false],
      pregnant: this.formBuilder.group({
        lastRuleDate: [null],
        weekNumber: [null],
        possibleDateOfBirth: [null]
      }),
      vitalSign: this.formBuilder.group({
        oxygenSaturation: ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
        bodyTemperature: ["", Validators.compose([Validators.required])],
        heartFrecuency: ["", Validators.compose([Validators.required])],
        bloodPressure: ["", Validators.compose([Validators.required])],
        breathingFrecuency: ["", Validators.compose([Validators.required])],
        resultOxygen: ["", Validators.compose([Validators.required])]
      }),
      antrophometry: this.formBuilder.group({
        weight: ["", Validators.compose([Validators.required])],
        height: ["", Validators.compose([Validators.required])],
        bodyMassiveIndex: ["", Validators.compose([Validators.required])],
        abdominalPerimeter: ["", Validators.compose([Validators.required])],
        clinicalExamination: [""],
        expedient: [""],
        resultIMC: [""],
      }),
      observationDiagnostic: [""],
      answerControl: ["", Validators.compose([Validators.required])],
      planningMedicalCouponTurnId: [""],
      saleDetailId: [""],
      diagnostics: this.formBuilder.array([]),
      prescriptions: this.formBuilder.array([]),
      active: [true],
      createdAt: [""]
    }

  }

  onInit() {
    this.formGroup.get("antrophometry.bodyMassiveIndex").disable()

    this.formGroup.get("vitalSign.oxygenSaturation").valueChanges.subscribe((valueDate) => {
      if (valueDate != null) {
        this.calcSaturation()
      }
    })

    combineLatest([
      this.formGroup.get("antrophometry.weight").valueChanges,
      this.formGroup.get("antrophometry.height").valueChanges,
    ]).subscribe(([weight, height]) => {

      if ((weight != null && weight != "") && (height != null && height != "")) {
        this.calculationIMC()
      }
    })

    this.registerUnSubcription(this.formGroup.get('isPregnant').valueChanges.subscribe((isPregnant) => {

      if (isPregnant) {
        this.formGroup.get('pregnant').enable();
      } else {
        this.formGroup.get('pregnant').disable();
      }

    }));

    this.registerUnSubcription(this.formGroup.get('pregnant.lastRuleDate').valueChanges.subscribe((valueDate) => {

      if (valueDate != null) {
        this.calculatePregnantByDate(valueDate);
      }

    }));
  }

  ngAfterContentInit() {

    this.detailInfo$ = this.route.params.pipe(
      switchMap((params) => {
        return this.saleDetailService.getInfoByDetail(params.detailId)
      }),
      tap((results) => {


        this.patientId = results.patientReservationId
        this.patient = results.patient
        this.doctor = results.planningMedicalCouponTurn.planningMedicalTurn.doctor

        this.formGroup.get("planningMedicalCouponTurnId").setValue(results.planningMedicalCouponTurnId)
        this.formGroup.get("saleDetailId").setValue(results._id)

        if (results.patient) {

          if (results.patient.gender == "M") {
            this.formGroup.get("isPregnant").disable()
            this.formGroup.get("pregnant").disable()
          } else {
            this.formGroup.get("isPregnant").enable()
            this.formGroup.get("pregnant").disable()
          }
        }
      }),
      shareReplay()
    )
  }

  calculatePregnantByDate(date: Date): void {

    //Fecha gestación
    let fecha_desde = moment(new Date(date));
    //Semanas gestando
    let semanas = moment().diff(moment(fecha_desde), 'weeks');
    //Fecha gestación mas 9 meses
    let fpmasnueve = moment(fecha_desde).add(9, 'month').format('YYYY-MM-DD');
    //Fecha mas 7 diás
    let fpp = moment(fpmasnueve).add(7, 'days').format('YYYY-MM-DD');

    this.formGroup.get('pregnant.weekNumber').setValue(semanas.toString());
    this.formGroup.get('pregnant.possibleDateOfBirth').setValue(fpp);
}

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as ActMedicalModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as ActMedicalModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  redirectToDashboard(): void {
    this.router.navigate(["/home/dashboard-doctor"])
  }

  showAge(date: Date): string {

    const now = moment()

    const diffAge = now.diff(moment(new Date(date)), "years")


    return `${diffAge} Año(s) ${now.format("M")} Mes(es)`
  }


  showPreviousStep(event?: Event) {

    if (this.currentStep == 0) {
      this.router.navigate(["/main"])
    } else {
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
        this.stepMessage = "Anamnesis"
        break
      case 1:
        this.stepMessage = "Signos Vitales / Antropometría"
        break
      case 2:
        this.stepMessage = "Plan de trabajo / Diagnósticos"
        break
      case 3:
        this.stepMessage = "Receta médica"
        break
    }

  }

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true)
  }

  calculationIMC() {

    const talla = (parseFloat(this.formGroup.get("antrophometry.height").value) / 100)

    const imc = parseFloat(this.formGroup.get("antrophometry.weight").value) / (talla * talla)

    this.formGroup.get("antrophometry.bodyMassiveIndex").setValue(parseFloat(imc.toString()).toFixed(2))

    // resultIMC

    if (imc < 18.5) {
      this.classIMC = "badge bg-primary"
      this.formGroup.get("antrophometry.resultIMC").setValue("Delgado")
    } else if (imc >= 18.5 && imc <= 24.9) {
      this.classIMC = "badge bg-info"
      this.formGroup.get("antrophometry.resultIMC").setValue("Aceptable")
    } else if (imc >= 25 && imc <= 29.9) {
      this.classIMC = "badge bg-success"
      this.formGroup.get("antrophometry.resultIMC").setValue("Sobrepeso")
    } else if (imc >= 30 && imc <= 34.9) {
      this.classIMC = "badge bg-warning"
      this.formGroup.get("antrophometry.resultIMC").setValue("Obesidad grado 1")
    } else if (imc >= 35 && imc <= 39.9) {
      this.classIMC = "badge bg-warning"
      this.formGroup.get("antrophometry.resultIMC").setValue("Obesidad grado 2")
    } else if (imc > 40) {
      this.classIMC = "badge bg-danger"
      this.formGroup.get("antrophometry.resultIMC").setValue("Obesidad grado 2")
    }
  }

  calcSaturation() {

    let oxigeno = parseInt(this.formGroup.get("vitalSign.oxygenSaturation").value)

    if (oxigeno >= 95 && oxigeno <= 100) {
      this.classOxigeno = "badge bg-success"
      this.formGroup.get("vitalSign.resultOxygen").setValue("Normal")
    } else if (oxigeno >= 91 && oxigeno <= 94) {
      this.classOxigeno = "badge bg-warning"
      this.formGroup.get("vitalSign.resultOxygen").setValue("Hipoxia leve")
    } else if (oxigeno >= 86 && oxigeno <= 90) {
      this.classOxigeno = "badge bg-danger"
      this.formGroup.get("vitalSign.resultOxygen").setValue("Hipoxia moderada")
    } else if (oxigeno <= 85 && oxigeno >= 1) {
      this.classOxigeno = "badge bg-danger"

      this.formGroup.get("vitalSign.resultOxygen").setValue("Hipoxia severa")
    } else {
      this.classOxigeno = ""
    }
  }

  loadDiagnostic(): void {


    const paymentGenerateModal = this.modalService.open(ImportDiagnosticModalComponent, <NgbModalOptions>{
      size: "lg",
      backdrop: "static"
    })

    paymentGenerateModal.result.then((selection: any) => {

      const details = <FormArray>this.formGroup.get("diagnostics")

      details.push(this.formBuilder.group(Object.assign(selection, {})))

    }, (reason) => {
      console.log("reason", reason)
    })
  }

  removeDiagnostic(event: any, index: number): void {
    if (index > -1) {
      (<FormArray>this.formGroup.get("diagnostics")).removeAt(index)
    }
  }

  removePrescription(event: any, index: number): void {
    if (index > -1) {
      (<FormArray>this.formGroup.get("prescriptions")).removeAt(index)
    }
  }

  printPrescription(row: any): void {
    this.contextService.startLoading()

    Object.assign(row, {
      patient: this.patient,
      doctor: this.doctor
    })

    const printName: string = `imprimir-receta-${moment().format("YYYYMMDDHHmmss")}`

    this.registerUnSubcription(this.actMedicalService.printPrescription(row).pipe(
      delay(1000),
      finalize(() => {
        this.contextService.stopLoading()
      })
    ).subscribe((result: Blob) => handleFile(result, printName)))
  }

  loadPrescription(): void {

    const modal = this.modalService.open(PrescriptionFormModalComponent, <NgbModalOptions>{
      windowClass: "xl-modal",
      backdrop: "static"
    })

    modal.result.then((selection: any) => {

      const details = <FormArray>this.formGroup.get("prescriptions")

      details.push(this.formBuilder.group({
        code: [selection.code],
        title: [selection.title, Validators.compose([Validators.required])],
        indication: [selection.indication],
        observation: [selection.observation],
        medicines: this.formBuilder.array(selection.medicines)
      }))

    }, (reason) => {
      console.log("reason", reason)
    })
  }

  loadEditPrescription(row: any, index: number): void {


    const paymentGenerateModal = this.modalService.open(PrescriptionFormModalComponent, <NgbModalOptions>{
      windowClass: "xl-modal",
      backdrop: "static"
    })

    const crudModal = paymentGenerateModal.componentInstance
    crudModal.populate(row)

    paymentGenerateModal.result.then((selection: any) => {

      const details = <FormArray>this.formGroup.get("prescriptions")

      const isElementInArray = details.value.find((d: any) => d.code === selection.code)

      if (!isElementInArray) {
        details.push(this.formBuilder.group(Object.assign(selection, {})))
      } else {
        let item = (<FormArray>this.formGroup.get("prescriptions")).at(index)

        item.patchValue({
          code: selection.code,
          title: selection.title,
          indication: selection.indication,
          observation: selection.observation,
          medicines: selection.medicines
        })
      }

    }, (reason) => {
      console.log("reason", reason)
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

  editAffectionPatient(row: any) {
    const crudForm = this.setupModal(ProfilePatientAffectionFormComponent, <NgbModalOptions> {
      size: "lg"
    });

    crudForm.populate(row)

    this._onResultSubcription = crudForm.onResult.subscribe((result) => {
      this.onRealTimeUpdate()
    });
  }

  onRefresh(criteria: IApiCriteria) {


    const filters = [...criteria.filters, <IFilterCriterion>{
      property: "patientId",
      type: FilterTypesEnum.Equals,
      typeValue: FilterTypeValue.ID,
      value: this.route.snapshot.queryParamMap.get('patientId')
    }]

    criteria.filters = filters

    this.records$ = this.sandboxService.listPage(PatientAffectionModel, criteria)
  }

  async submit(event: any) {

    try {

      if (this.formGroup.invalid) {

        this.toastr.error("Faltan campos por completar", "Ops!")

        validateAllFormFields(this.formGroup)
        return
      }

      Swal.fire({
        title: `Registar atención médica`,
        text: `¿Esta seguro de realizar esta operación?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Registrar",
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
              this.redirectToDashboard()
            })
          } else { // Create

            await this.create(modelCasted).then((result) => {
              this.redirectToDashboard()
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
