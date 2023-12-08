import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, TemplateRef, ViewChildren, QueryList, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFilterCriterion } from '../../../../../interfaces/ui-filter-criterion.interface';

@Component({
    selector: 'ui-modal-filter-datatable',
    templateUrl: './ui-modal-filter-datatable.component.html',
    styleUrls: ['./ui-modal-filter-datatable.component.scss']
})
export class UIModalFilterDatatableComponent implements OnInit, AfterViewInit {

    @Output() result = new EventEmitter<any>();

    @Output() afterViewInit = new EventEmitter<void>();

    @Input() filtersDef: TemplateRef<any>;

    @Input() sessionFilters: Array<IFilterCriterion>;

    get context() {
        return this;
    }

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.afterViewInit.emit();
    }

    cancel() {
        this.activeModal.dismiss(this.sessionFilters);
    }

    filter() {
        this.activeModal.close(this.sessionFilters);
    }
}
