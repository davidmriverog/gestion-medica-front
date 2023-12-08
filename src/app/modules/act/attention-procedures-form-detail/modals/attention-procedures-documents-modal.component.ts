import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription } from "rxjs";
import * as _ from 'lodash';
import * as UUID from 'uuid';

import * as moment from 'moment';

import { select, Store } from "@ngrx/store";
import { delay, finalize } from "rxjs/operators";
import { SysFileService } from "src/app/project/services/sys/sys-file.service";
import { handleFile, IAppState, IContextService } from "src/app/exports/lib";

@Component({
  selector: 'attention-procedures-documents-modal',
  templateUrl: './attention-procedures-documents-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AttentionProceduresDocumentModalComponent implements OnInit, AfterViewInit, OnDestroy {

  selected: any;

  afterContentForm: any;

  subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
    private fileService: SysFileService,
    private contextService: IContextService
  ) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit(): void {

    if (this.afterContentForm) {
      //
    }
  }

  populate(row: any) {
    this.afterContentForm = row;
  }

  download(fileId: string, fileName?: string): void {
    this.contextService.startLoading();

    const printName: string = fileName ? fileName : `archivo-${moment().format('YYYYMMDDHHmmss')}`;

    this.subscriptions.push(this.fileService.download(fileId).pipe(
      delay(1000),
      finalize(() => {
        this.contextService.stopLoading();
      })
    ).subscribe((result: Blob) => handleFile(result, printName)));
  }
}
