import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, TemplateRef, ViewChildren, QueryList, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFilterCriterion } from '../../../../../interfaces/ui-filter-criterion.interface';

@Component({
  selector: 'ui-modal-filter-table',
  templateUrl: './ui-modal-filter-table.component.html',
  styles: [`
    .md-dialog div.modal-dialog {
      width: 600px !important;
      max-width: unset;
    }
  `]
})
export class UIModalFilterTableComponent implements OnInit, AfterViewInit {

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
