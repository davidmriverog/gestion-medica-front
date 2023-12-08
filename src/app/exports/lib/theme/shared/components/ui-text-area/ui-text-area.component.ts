import { Component, Input, forwardRef, OnInit, Optional, Host, SkipSelf, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup } from "@angular/forms";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: "ui-text-area",
    templateUrl: "./ui-text-area.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UITextAreaComponent),
            multi: true
        }
    ]
})
export class UITextAreaComponent implements ControlValueAccessor, OnInit {
    control: AbstractControl;

    @Input()
    debounceInput = 0;

    @Input()
    value: string;

    @Input()
    rows: number;
    @Input()
    disabled: boolean = false;
    @Input()
    formControlName: string;
    @Input("group")
    formGroup: FormGroup;

    @Output()
    input: EventEmitter<any> = new EventEmitter();

    @ViewChild('innerInput', { static: true }) innerInput: ElementRef;

    isDebouncing = false;

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        private controlContainer: ControlContainer
    ) { }

    ngOnInit() {
        if (this.formControlName && this.controlContainer) {
            this.control = this.controlContainer.control.get(this.formControlName);
        }

        fromEvent(this.innerInput.nativeElement, 'input')
            .pipe(debounceTime(this.debounceInput))
            .subscribe(event => {
                this.input.emit(event);
            });
    }

    propagateChange = (_: any) => { };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value: string) {
        this.value = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    registerOnTouched() { }

    onChange(event: any) {
        this.propagateChange(event);
    }

    onInput(event) {
        this.input.emit(event);
    }
}
