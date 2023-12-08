import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ElementRef, ViewChild, Optional, Host, SkipSelf, OnDestroy, AfterViewChecked, ChangeDetectorRef, AfterViewInit, AfterContentChecked, OnChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup, ControlValueAccessor, FormBuilder, Validators } from '@angular/forms';
import { MaskDirective } from 'ngx-mask';

type SN = string | number;

@Component({
    selector: 'ui-form-mask',
    templateUrl: './ui-form-mask.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UIFormMaskComponent),
            multi: true
        }
    ]
})
export class UIFormMaskComponent implements ControlValueAccessor, AfterContentChecked, AfterViewInit, OnInit, OnDestroy, OnChanges {

    control: AbstractControl;

    @ViewChild(MaskDirective, { static: true }) customMask: MaskDirective;

    @Input()
    totalCharacters: number = 0;

    @Input()
    debounceInput = 0;

    @Input()
    value: SN;

    @Input()
    disabled = false;

    @Input()
    formControlName: string;

    @Input('group')
    formGroup: FormGroup;

    @Input()
    masked: string;

    @Input()
    placeholder: string = 'Ingrese datos.';

    @Output()
    input: EventEmitter<any> = new EventEmitter();

    isDebouncing = false;
    @ViewChild('innerInput', { static: true })
    innerInput: ElementRef;

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        private controlContainer: ControlContainer,
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ) {
        //
    }


    ngOnInit() {

        if (this.formControlName && this.controlContainer) {
            this.control = this.controlContainer.control.get(this.formControlName);
        }

    }

    ngOnChanges(): void {
        //
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngAfterViewInit(): void {
        //
    }

    ngOnDestroy(): void {
        //
    }

    writeValue(value: SN) {
        this.value = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    registerOnTouched() { }

    propagateChange = (_: any) => { };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    focus(): void {
        this.innerInput.nativeElement.focus();
    }

    onChange(event: any): void {
        if (this.value != '') {
            this.propagateChange(this.value);
        }
    }
}
