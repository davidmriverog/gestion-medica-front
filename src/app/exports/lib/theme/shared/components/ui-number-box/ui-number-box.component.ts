import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ElementRef, ViewChild, Optional, Host, SkipSelf, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup, ControlValueAccessor, FormBuilder } from '@angular/forms';
import {  Subject } from 'rxjs';

@Component({
    selector: 'ui-number-box',
    templateUrl: './ui-number-box.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UINumberBoxComponent),
            multi: true
        }
    ]
})
export class UINumberBoxComponent implements ControlValueAccessor, OnInit, OnDestroy {

    control: AbstractControl;

    @Input()
    debounceInput = 0;

    @Input()
    decimal = 2;
    @Input()
    prefix = '';

    @Input()
    amount = '';

    @Input()
    disabled = false;

    @Input()
    formControlName: string;

    @Input('group')
    formGroup: FormGroup;


    @Output()
    change: EventEmitter<any> = new EventEmitter();

    isDebouncing = false;
    @ViewChild('innerInput', { static: true })
    innerInput: ElementRef;

    private destroy$ = new Subject<void>();

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        private controlContainer: ControlContainer,
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ) {

    }

    ngOnInit() {

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

    writeValue(value: string) {

        this.amount = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    registerOnTouched() { }

    focus(): void {
        this.innerInput.nativeElement.focus();
    }

    onChange(event: any) {
        this.registerOnTouched();
        this.propagateChange(event);
    }
}
