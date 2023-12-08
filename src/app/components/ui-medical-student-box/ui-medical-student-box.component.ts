import { Component, OnInit, Input, EventEmitter, Output, forwardRef, SkipSelf, Host, Optional, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { MedicalStudentFormComponent } from '../../modules/clinic/medical-students/medical-student-form.component';
import { MedicalStudentService } from 'src/app/project/services/clinic/medical-student.service';
import { MedicalStudentModel } from 'src/app/project/models/clinic/medical-student.model';

@Component({
  selector: 'ui-medical-student-box',
  templateUrl: './ui-medical-student-box.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIMedicalStudentBoxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class UIMedicalStudentBoxComponent implements OnInit, OnDestroy, ControlValueAccessor {

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
    private medicalStudentService: MedicalStudentService,
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

  writeValue(value: any): void {

    if (value == null) {
      this.isSeleted = false;
      this.clearProviderSelect();
    }
  }

  onPopulated(value: any) {
    //
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnTouched() { }

  search(event: { query: string }): void {

    this.filteredResult$ = this.medicalStudentService.searching(event.query.toLocaleLowerCase());
  }

  select(selection: any) {

    this.registerOnTouched();

    this.isSeleted = true;
    this.selectedValue = selection;

    this.populateChanged();

    this.changed.emit(selection);
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
  }

  populatedModalSelection(row: MedicalStudentModel): void {
    this.isSeleted = true;
    this.selectedValue = row;

    this.populateChanged();

    this.changed.emit(row);
  }

  loadPopulated(data: any): void {
    /*this.companyService.findProviders(data.company_id).pipe(
        takeUntil(this.destroyed$)
    ).subscribe((company) => console.log(company)); */
  }

  create(): void {
    const formModal = this.modalService.open(MedicalStudentFormComponent, <NgbModalOptions>{
      size: 'lg',
      centered: true
    });

    const crudForm = formModal.componentInstance;

    crudForm.onResult.subscribe((results: any) => {


      let currentResult: MedicalStudentModel = results.data;

      const fullName = `${currentResult.name} - ${currentResult.code}`;

      currentResult.fullName = fullName;

      this.populatedModalSelection(currentResult);

    });
  }
}