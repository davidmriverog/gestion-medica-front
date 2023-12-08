import { Component, Input, AfterViewInit, OnChanges, Optional, Host, SkipSelf, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

import { hasRequiredField } from '../../../../utils/validator.utils';

@Component({
    selector: 'ui-label',
    templateUrl: './ui-label.component.html'
})
export class UILabelComponent implements AfterViewInit, OnInit, OnChanges {

    control: AbstractControl;

    @Input()
    message: string = '';

    @Input()
    group?: FormGroup;
    @Input()
    name: string;
    @Input()
    set text(t: string) {
        this._text = t;
    }

    get text(): string {
        return this._text;
    }

    _text = '';
    _posfix = '';

    constructor(
        private controlContainer: ControlContainer
    ) { }

    ngOnInit(): void {

        if (this.name && this.controlContainer) {
            this.control = this.controlContainer.control.get(this.name);
        }

        this.verifyRequired();
    }

    ngAfterViewInit() {
        // this.verifyRequired();
    }

    ngOnChanges() {
        this.verifyRequired();
    }

    verifyRequired() {

        if (this.control) {

            const isRequired = hasRequiredField(this.control);
            if (isRequired) {
                this._posfix = ' (*)';
            } else {
                this._posfix = '';
            }
        }
    }
}
