import { Component, Input, forwardRef, Output, EventEmitter, Optional, Host, SkipSelf, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, AbstractControl, FormGroup } from "@angular/forms";
import * as UUID from "uuid";

@Component({
    selector: "ui-check-box",
    templateUrl: "./ui-check-box.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UICheckBoxComponent),
            multi: true
        }
    ]
})
export class UICheckBoxComponent implements ControlValueAccessor, OnInit {
    control: AbstractControl;
    
    @Input()
    label: string;
    @Input()
    checked: boolean = false;
    @Input()
    inline: boolean = false;
    @Input()
    disabled: boolean = false;
    @Input()
    formControlName: string;
    @Input("group")
    formGroup: FormGroup;

    @Output()
    change: EventEmitter<any> = new EventEmitter();

    identifier: string = UUID.v1();

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

    writeValue(value: boolean) {
        this.checked = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    registerOnTouched() {}

    onChange(event: any) {
        this.checked = !this.checked;

        this.registerOnTouched();
        this.change.emit(this.checked);
        this.propagateChange(this.checked);
    }
}
