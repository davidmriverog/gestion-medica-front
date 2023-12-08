import { Component, OnInit, Input, EventEmitter, Output, forwardRef, SkipSelf, Host, Optional, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { PatientFormComponent } from '../../modules/clinic/patients/patient-form.component';
import { PatientService } from 'src/app/project/services/clinic/patient.service';
import { SandboxAPIService } from 'src/app/exports/lib';
import { PatientModel } from 'src/app/project/models/clinic/patient.model';

@Component({
  selector: 'ui-patient-box',
  templateUrl: './ui-patient-box.component.html',
  styleUrls: ['./ui-patient-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIPatientBoxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class UIPatientBoxComponent implements OnInit, OnDestroy, ControlValueAccessor {

  control: AbstractControl;

  @Input()
  placeholder: string;

  @Input()
  disabled = false;

  @Input()
  records: Array<any> = [];

  @Input()
  formControlName: string;

  @Input('group')
  formGroup: FormGroup;

  filteredResult$: Observable<Array<any>>;

  selectedValue: any;

  wordSelected: any;

  isSeleted: boolean = false;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private sandboxService: SandboxAPIService,
    private modalService: NgbModal
  ) {
    //
  }

  ngOnInit() {
    if (this.formControlName && this.controlContainer) { this.control = this.controlContainer.control.get(this.formControlName); }
  }

  ngOnDestroy(): void {
    //
  }

  writeValue(value: string): void {
    if (value != null && value != "") {
      console.log('write.patient', value);
      this.onPopulated(value);
    } else {

      this.selectedValue = null;

      if (!this.disabled) {
        this.isSeleted = false;
      }
    }
  }

  onPopulated(value: any) {

    this.sandboxService.findById<PatientModel>(PatientModel, value).subscribe((patientResult) => {
      if (patientResult) {
        let currentResult: PatientModel = patientResult;

        const fullName = `${currentResult.documentNumber} - ${currentResult.firstName} - ${currentResult.firstSurname} Nro. Historia - ${currentResult.historyNumber}`;

        currentResult.fullName = fullName;

        this.populatedModalSelection(currentResult);
      }
    });
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (isDisabled) {
      this.selectedValue = null;
      this.isSeleted = true;
    } else {
      this.selectedValue = null;
      this.isSeleted = false;
    }
  }

  registerOnTouched() { }

  search(event: { query: string }): void {
    this.filteredResult$ = this.patientService.searching(event.query.toLocaleLowerCase());
  }

  select(selection: any) {

    this.isSeleted = true;
    this.selectedValue = selection;

    this.populateChanged();
  }

  onClear(event: any) {

    console.log('onClear', event);
  }

  onKeyUp(event: any) {
    //
  }

  onBlur(event: any) {
    //
  }

  clearProviderSelect(): void {
    this.selectedValue = null;
    this.isSeleted = false;
  }


  populateChanged(): void {
    this.propagateChange(this.selectedValue ? this.selectedValue._id : null);

    this.changed.emit(this.selectedValue ? this.selectedValue : null);
  }

  populatedModalSelection(row: PatientModel): void {
    this.isSeleted = true;
    this.selectedValue = row;

    this.populateChanged();
  }

  loadPopulated(data: any): void {
    /*this.companyService.findProviders(data.company_id).pipe(
        takeUntil(this.destroyed$)
    ).subscribe((company) => console.log(company)); */
  }

  create(): void {
    const formModal = this.modalService.open(PatientFormComponent, <NgbModalOptions>{
      size: 'lg',
      centered: true
    });

    const crudForm = formModal.componentInstance;

    crudForm.onResult.subscribe((results: any) => {


      let currentResult: PatientModel = results.data;

      const fullName = `${currentResult.documentNumber} - ${currentResult.firstName} - ${currentResult.firstSurname} Nro. Historia - ${currentResult.historyNumber}`;

      currentResult.fullName = fullName;

      this.populatedModalSelection(currentResult);

    });
  }
}