import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core"
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { ToastrService } from "ngx-toastr"
import { Observable } from "rxjs"
import * as _ from "lodash"
import * as UUID from "uuid"

import { select, Store } from "@ngrx/store"
import { IAppState, validateAllFormFields, UIFileInterface } from "src/app/exports/lib"

@Component({
    selector: "attention-procedure-document-modal",
    templateUrl: "./attention-procedure-document-modal.component.html"
})
export class AttentionProcedureDocumentFormModalComponent implements OnInit, AfterViewInit, OnDestroy {

    selected: any

    formDocument: FormGroup

    afterContentForm: any

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private store: Store<IAppState>
    ) {

    }

    ngOnInit(): void {

        this.formDocument = this.formBuilder.group({
            title: ["", Validators.compose([Validators.required])],
            responsibleDoctor: ["", Validators.compose([Validators.required])],
            attachments: [[]]
        })
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

        if (this.afterContentForm) {


            let attachments: UIFileInterface[] = []

            if (this.afterContentForm.attachments instanceof Array) {
                attachments = [...attachments, ...this.afterContentForm.attachments]
            } else {
                attachments = [...attachments, this.afterContentForm.attachments]
            }

            this.formDocument.get("title").setValue(this.afterContentForm.title)
            this.formDocument.get("responsibleDoctor").setValue(this.afterContentForm.responsibleDoctor)
            this.formDocument.get("attachments").setValue(attachments)
        }
    }

    populate(row: any) {
        this.afterContentForm = row
    }

    saveDocument(): void {

        if (this.formDocument.invalid) {
            this.toastr.error("Faltan completar campos obligatorios")
            validateAllFormFields(this.formDocument)
            return
        }

        this.activeModal.close(this.formDocument.getRawValue())
    }
}
