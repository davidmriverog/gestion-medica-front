import { Component, Input, AfterViewInit, OnChanges, Optional, Host, SkipSelf, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

@Component({
    selector: 'ui-progressing-bar',
    templateUrl: './progressing-bar.component.html',
    styleUrls: ['./progressing-bar.component.scss']
})
export class UIProgressingBarComponent implements AfterViewInit, OnInit, OnChanges {

    @Input()
    progress: number = 0;

    constructor(

    ) { }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        // this.verifyRequired();
    }

    ngOnChanges() {

    }

}
