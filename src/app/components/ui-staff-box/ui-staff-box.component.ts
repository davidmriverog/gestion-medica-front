import { Component, OnInit, Input, EventEmitter, Output, forwardRef, SkipSelf, Host, Optional, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StaffModel } from '../../project/models/sys/staff.model';
import { SysStaffService } from '../../project/services/sys/sys-staff.service';
import { StaffFormComponent } from '../../modules/sys/staffs/staff-form.component';

@Component({
  selector: 'ui-staff-box',
  templateUrl: './ui-staff-box.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIStaffBoxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class UIStaffBoxComponent implements OnInit, OnDestroy, ControlValueAccessor {

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
    private staffService: SysStaffService,
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
    if (value != null) {
      this.onPopulated(value);
    } else {
      this.isSeleted = false;
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

    this.filteredResult$ = this.staffService.searching(event.query.toLocaleLowerCase());
  }

  select(selection: any) {

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

  populatedModalSelection(row: StaffModel): void {
    this.isSeleted = true;
    this.selectedValue = row;

    this.populateChanged();
  }

  create(): void {

    const formModal = this.modalService.open(StaffFormComponent, <NgbModalOptions>{
      size: 'lg',
      centered: true
    });

    const crudForm = formModal.componentInstance;

    crudForm.onResult.subscribe((results: any) => {


      const currentResult: StaffModel = results.data;

      const fullName = `${currentResult.documentNumber} - ${currentResult.firstName} ${currentResult.lastName}`;

      results.data.fullName = fullName;

      this.populatedModalSelection(results.data);

    });
  }

  loadPopulated(data: any): void {
    /*this.companyService.findProviders(data.company_id).pipe(
        takeUntil(this.destroyed$)
    ).subscribe((company) => console.log(company)); */
  }
}