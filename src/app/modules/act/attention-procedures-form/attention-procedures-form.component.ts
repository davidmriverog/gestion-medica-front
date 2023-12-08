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
import { ProductCategoryEnum } from "src/app/core/enums/ar/product-category.enum"
import { AttentionProcedureDocumentFormModalComponent } from "./modals/attention-procedure-document-modal.component"

@Component({
  selector: "attention-procedures-form",
  templateUrl: "./attention-procedures-form.component.html",
  styleUrls:['./attention-procedures-form.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class AttentionProcedureFormComponent extends AdminCrudForm implements AfterContentInit {

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

  productCategoryEnum = ProductCategoryEnum

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
      type: [ProductCategoryEnum.PROC],
      medicalReport: ['', Validators.compose([Validators.required])],
      prescriptions: this.formBuilder.array([]),
      documents: this.formBuilder.array([]),
      observationDiagnostic: ['NO'],
      answerControl: [null],
      saleDetailId: [''],
      planningMedicalCouponTurnId: [''],
      active: [true],
      createdAt: [""]
    }

  }

  onInit() {

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
      }),
      shareReplay()
    )
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
        this.stepMessage = "Informe médico"
        break
      case 1:
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

    const crudForm = this.setupModal(ProfilePatientAffectionFormComponent, <NgbModalOptions>{
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

  removeDocument(event: any, index: number): void {
    if (index > -1) {
      (<FormArray>this.formGroup.get('documents')).removeAt(index);
    }
  }

  loadDocuments(): void {

    const modal = this.modalService.open(AttentionProcedureDocumentFormModalComponent, <NgbModalOptions>{
      windowClass: 'xl-modal',
      backdrop: 'static'
    });

    modal.result.then((selection: any) => {

      const details = <FormArray>this.formGroup.get('documents');

      details.push(this.formBuilder.group({
        title: [selection.title, Validators.compose([Validators.required])],
        responsibleDoctor: [selection.responsibleDoctor],
        attachments: [selection.attachments]
      }));

    }, (reason) => {
      console.log('reason', reason);
    });
  }

  loadEditDocument(row: any, index: number): void {

    const paymentGenerateModal = this.modalService.open(AttentionProcedureDocumentFormModalComponent, <NgbModalOptions>{
      windowClass: 'xl-modal',
      backdrop: 'static'
    });

    const crudModal = paymentGenerateModal.componentInstance;
    crudModal.populate(row);

    paymentGenerateModal.result.then((selection: any) => {


      const details = <FormArray>this.formGroup.get('documents');

      const isElementInArray = details.value.find((d: any) => d.code === selection.code);

      if (!isElementInArray) {
        details.push(this.formBuilder.group(Object.assign(selection, {})));
      } else {
        let item = (<FormArray>this.formGroup.get('documents')).at(index);

        item.patchValue({
          code: selection.code,
          title: selection.title,
          responsibleDoctor: selection.responsibleDoctor,
          attachments: [selection.attachments]
        });
      }

    }, (reason) => {
      console.log('reason', reason);
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
        title: `Registar procedimiento médico`,
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
