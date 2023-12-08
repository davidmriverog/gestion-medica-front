import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core"
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { ToastrService } from "ngx-toastr"
import { Observable } from "rxjs"
import * as _ from "lodash"
import * as UUID from "uuid"
import { Store } from "@ngrx/store"

import { IAppState, validateAllFormFields, SandboxAPIService } from "../../../../exports/lib"

import { MedicineModel } from "../../../../project/models/clinic/medicine.model"

@Component({
  selector: "import-prescription-modal",
  templateUrl: "./import-prescription-modal.component.html",
  encapsulation: ViewEncapsulation.None
})
export class PrescriptionFormModalComponent implements OnInit, AfterViewInit, OnDestroy {

  selected: any

  formPrescription: FormGroup
  formMedicine: FormGroup

  medicines$: Observable<Array<MedicineModel>>

  afterContentForm: any

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
    private sandboxAPIService: SandboxAPIService
  ) {

  }

  ngOnInit(): void {

    this.formPrescription = this.formBuilder.group({
      code: [UUID.v1()],
      title: ["", Validators.compose([Validators.required])],
      indication: [""],
      observation: [""],
      medicines: this.formBuilder.array([])
    })

    this.createMedicine()

    this.medicines$ = this.sandboxAPIService.findAll<MedicineModel>(MedicineModel)
  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit(): void {

    if (this.afterContentForm) {

      this.formPrescription.get("title").setValue(this.afterContentForm.title)
      this.formPrescription.get("code").setValue(this.afterContentForm.code)
      this.formPrescription.get("indication").setValue(this.afterContentForm.indication)
      this.formPrescription.get("observation").setValue(this.afterContentForm.observation)

      const details = <FormArray>this.formPrescription.get("medicines")

      let medicines: Array<any> = new Array<any>()

      if (this.afterContentForm.medicines instanceof Array) {
        medicines = this.afterContentForm.medicines
      } else {

        medicines.push(Object.assign(this.afterContentForm.medicines, {}))
      }

      medicines.map((item) => {

        details.push(this.formBuilder.group({
          medicineId: [item.medicineId],
          medicine: [item.medicine != null ? item.medicine : null],
          posology: [item.posology],
          indication: [item.indication],
          quantity: [item.quantity],
          medicineName: [item.medicineName],
        }))
      })
    }
  }

  private createMedicine(): void {
    this.formMedicine = this.formBuilder.group({
      medicineId: [""],
      indication: [""],
      posology: [""],
      quantity: [""]
    })
  }

  populate(row: any) {
    this.afterContentForm = row
  }

  addMedicine(): void {

    if (this.formMedicine.invalid) {
      this.toastr.error("Faltan completar campos de la receta")
      validateAllFormFields(this.formMedicine)
      return
    }

    const details = <FormArray>this.formPrescription.get("medicines")

    details.push(this.formBuilder.group({
      medicineId: [this.formMedicine.get("medicineId").value],
      posology: [this.formMedicine.get("posology").value],
      indication: [this.formMedicine.get("indication").value],
      quantity: [this.formMedicine.get("quantity").value],
      medicineName: [this.selected.name],
    }))

    this.formMedicine.reset()
    this.selected = null
  }

  selectedMedicine(event: any): void {
    this.selected = event
  }

  removeMedicine(index: number): void {
    if (index > -1) {
      (<FormArray>this.formPrescription.get("medicines")).removeAt(index)
    }
  }

  savePrescription(): void {

    if (this.formPrescription.invalid) {
      this.toastr.error("Faltan completar campos obligatorios")
      validateAllFormFields(this.formPrescription)
      return
    }

    const details = <FormArray>this.formPrescription.get("medicines")

    if (details.value.length === 0) {

      this.toastr.warning("Cargue por favor un medicamento.", "Atención!", {
        progressBar: true,
        progressAnimation: "increasing",
        closeButton: true
      })

      validateAllFormFields(this.formPrescription)
      return
    }

    this.activeModal.close(this.formPrescription.getRawValue())
  }
}
