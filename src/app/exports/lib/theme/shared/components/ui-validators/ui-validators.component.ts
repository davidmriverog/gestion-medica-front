import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, Host, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

export enum ErrorTypeEnum {
    Required = 'required'
}

@Component({
    selector: 'ui-validators',
    templateUrl: './ui-validators.component.html',
    styleUrls: ['./ui-validators.component.scss']
})
export class UIValidatorsComponent implements OnInit, AfterViewInit, OnChanges {

    control: AbstractControl;

    @Input('group')
    formGroup: FormGroup;
    @Input()
    name: string;

    errors: Array<{ message: string}> = new Array<{ message: string}>();

    constructor(
        private controlContainer: ControlContainer
    ) {

    }

    ngOnInit(): void {
        if (this.name && this.controlContainer) {
            this.control = this.controlContainer.control.get(this.name);
        }
    }

    ngAfterViewInit(): void {
        //
    }

    ngOnChanges(changes: SimpleChanges): void {
        //
    }
}
