import { Component, Input, forwardRef, OnInit, Optional, Host, SkipSelf, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';

import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: "ui-editor-box",
    templateUrl: './ui-editor-box.component.html',
    styleUrls: ['./ui-editor-box.component.scss'],
    providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UIEditorBoxComponent),
        multi: true
    }
    ],
    encapsulation: ViewEncapsulation.None
})
export class UIEditorBoxComponent implements ControlValueAccessor, OnInit {

    control: AbstractControl;

    @Input()
    htmlContent: string;

    /*@Input()
    config: any;*/

    @Input()
    disabled: boolean = false;

    @Input()
    formControlName: string;
    @Input('group')
    formGroup: FormGroup;

    @Input()
    containerCssClass: string = 'ckeditor-height-150';

    @Input()
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '250px',
        minHeight: '5rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [
            ['bold']
        ],
        customClasses: [
            {
                name: "quote",
                class: "quote",
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ],
        fonts: [
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ]
    };

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        private controlContainer: ControlContainer
        ) { }

    ngOnInit() {
        if (this.formControlName && this.controlContainer) this.control = this.controlContainer.control.get(this.formControlName);
    }

    propagateChange = (_: any) => { };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value: string) {
        this.htmlContent = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    registerOnTouched() { }

    onChange(event: any) {

        this.propagateChange(event);
    }

}
