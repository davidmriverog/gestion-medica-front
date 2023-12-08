import { BsDaterangepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ElementRef, ViewChild, Optional, Host, SkipSelf, OnDestroy, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup, ControlValueAccessor, FormBuilder } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { listLocales } from 'ngx-bootstrap/chronos';

import * as moment from 'moment-timezone';

@Component({
  selector: 'ui-form-date-ranger',
  templateUrl: './ui-form-date-ranger.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIFormDateRangerComponent),
      multi: true
    }
  ]
})
export class UIFormDateRangerComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

  @ViewChild('drp', { static: true }) datepicker: BsDaterangepickerDirective;

  control: AbstractControl;

  @Input()
  debounceInput = 0;

  @Input()
  placeholder: string = '';

  @Input()
  value: Date;

  @Input()
  disabled = false;

  @Input()
  formControlName: string;

  @Input()
  minDate: Date;

  @Input()
  maxDate: Date;

  @Input('group')
  formGroup: FormGroup;


  @Output()
  input: EventEmitter<any> = new EventEmitter();

  isDebouncing = false;
  @ViewChild('innerInput', { static: true })
  innerInput: ElementRef;

  bsConfigDate: any = {
    rangeInputFormat: 'DD-MM-YYYY',
    adaptivePosition: true,
    isAnimated: true,
    containerClass: 'theme-green'
  };

  locale = 'es-us';
  locales = listLocales();

  valueSelected: Date[];

  formGroupDate: FormGroup;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService
  ) {
    this.localeService.use(this.locale);

    this.formGroupDate = this.formBuilder.group({
      current: [new Date()]
    });
  }

  ngAfterViewInit(): void {

    if (this.minDate) {
      this.datepicker.minDate = this.minDate;
    }
  }

  ngOnInit(): void {

    if (this.formControlName && this.controlContainer) {
      this.control = this.controlContainer.control.get(this.formControlName);
    }
  }

  ngOnDestroy(): void {

  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  writeValue(value: any) {

    if (value instanceof Array) {
      this.valueSelected = value;
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnTouched() { }

  focus(): void {
    this.innerInput.nativeElement.focus();
  }

  onChange(valueDate: Date[]) {

    if (valueDate != null) {
      let utcDates: Date[] = []

      const dateMy = valueDate[0].toUTCString()

      const startStr = moment(valueDate[0]).format("YYYY-MM-DD")
      const endStr = moment(valueDate[1]).format("YYYY-MM-DD")

      utcDates = [...utcDates, moment.utc(startStr).startOf("day").toDate()]
      utcDates = [...utcDates, moment.utc(endStr).endOf("day").toDate()]

      this.propagateChange(utcDates);
    }
  }
}
