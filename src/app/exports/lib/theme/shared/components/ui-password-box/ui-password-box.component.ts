import { Component, Input, Output, EventEmitter, forwardRef, OnInit, Optional, Host, SkipSelf } from "@angular/core";
import { FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor, ControlContainer, AbstractControl } from "@angular/forms";

@Component({
    selector: "ui-password-box",
    templateUrl: "./ui-password-box.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UIPasswordBoxComponent),
            multi: true
        }
    ]
})
export class UIPasswordBoxComponent implements ControlValueAccessor, OnInit {
    control: AbstractControl;
    value: string;

    @Input()
    disabled: boolean = false;
    @Input()
    formControlName: string;
    @Input("group")
    formGroup: FormGroup;

    @Output()
    input: EventEmitter<any> = new EventEmitter();

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        private controlContainer: ControlContainer
    ) {}

    ngOnInit() {
        if (this.formControlName && this.controlContainer) this.control = this.controlContainer.control.get(this.formControlName);
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value: string) {
        this.value = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    registerOnTouched() {}

    onChange(event: any) {
        this.propagateChange(event);
    }

    onInput(event) {
        this.input.emit(event);
    }
}
