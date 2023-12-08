import { Component, Input, forwardRef, Output, EventEmitter, Optional, Host, SkipSelf, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, AbstractControl, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'ui-color-box',
    templateUrl: './ui-color-box.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UIColorBoxComponent),
            multi: true
        }
    ]
})
export class UIColorBoxComponent implements ControlValueAccessor, OnInit {
    control: AbstractControl;
    @Input()
    debounceInput = 0;
    @Input()
    value = '';
    @Input()
    placeholder = '';

    @Input()
    disabled = false;
    @Input()
    formControlName: string;
    @Input('group')
    formGroup: FormGroup;

    @Output()
    input: EventEmitter<any> = new EventEmitter();

    isDebouncing = false;
    @ViewChild('innerInput', { static: true }) innerInput: ElementRef;

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

        this.registerOnTouched();
        this.propagateChange(event.value);
    }
}
