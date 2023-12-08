import { Component, Input, forwardRef, Output, EventEmitter, Optional, Host, SkipSelf, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, AbstractControl, FormGroup } from '@angular/forms';
import * as UUID from 'uuid';

@Component({
    selector: 'ui-form-radio',
    templateUrl: './ui-form-radio.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UIFormRadioComponent),
            multi: true
        }
    ]
})
export class UIFormRadioComponent implements ControlValueAccessor, OnInit {
    control: AbstractControl;

    @Input()
    label: string;
    @Input()
    value: string;
    @Input()
    checked = false;
    @Input()
    inline = false;
    @Input()
    disabled = false;
    @Input()
    formControlName: string;
    @Input('group')
    formGroup: FormGroup;

    @Output()
    change: EventEmitter<any> = new EventEmitter();

    identifier: string = UUID.v1();
    groupValue: string;

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        private controlContainer: ControlContainer
    ) {}

    ngOnInit() {
        if (this.formControlName && this.controlContainer) {
            this.control = this.controlContainer.control.get(this.formControlName);
        }
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value: string) {
        this.groupValue = value;
        this.checked = this.value == this.groupValue;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnTouched() {}

    onChange(event: any) {
        this.value = event;
        this.checked = true;

        this.registerOnTouched();
        this.change.emit(this.value);
        this.propagateChange(this.value);
    }
}
