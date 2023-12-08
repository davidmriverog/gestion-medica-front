import { BsDaterangepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ElementRef, ViewChild, Optional, Host, SkipSelf, OnDestroy, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup, ControlValueAccessor, FormBuilder } from '@angular/forms';

import { listLocales } from 'ngx-bootstrap/chronos';

import * as moment from 'moment';

@Component({
    selector: 'ui-form-date',
    templateUrl: './ui-form-date.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UIFormDateComponent),
            multi: true
        }
    ]
})
export class UIFormDateComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

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
        dateInputFormat: 'DD-MM-YYYY',
        adaptivePosition: true,
        isAnimated: true,
        containerClass: 'theme-green',

    };

    locale = 'es-us';
    locales = listLocales();

    valueSelected: Date;

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

        if (value) {

            const currentDate = moment.utc(value).format("YYYY-MM-DD")
            const valueDate: Date = moment(currentDate).startOf('days').toDate()

            this.valueSelected = valueDate
        }
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    registerOnTouched() { }

    focus(): void {
        this.innerInput.nativeElement.focus();
    }

    onChange(valueDate: Date) {

        if (valueDate != null) {
            this.propagateChange(valueDate);
        }
    }
}
