import { Component, OnDestroy, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { IAppState, SandboxAPIService } from "../../../../exports/lib"
import { Store } from "@ngrx/store"
import { ToastrService } from "ngx-toastr"
import { Observable} from "rxjs"
import * as _ from "lodash"

import { DiagnosticModel } from "../../../../project/models/clinic/diagnostic.model"

@Component({
  selector: "import-diagnostic-modal",
  templateUrl: "./import-diagnostic-modal.component.html"
})
export class ImportDiagnosticModalComponent implements OnInit, OnDestroy {

  selected: Array<any>

  formDiagnostic: FormGroup

  diagnosticTypes: Array<{ id: string, name: string }> = []

  diagnosticSelected: any

  diagnostics$: Observable<Array<DiagnosticModel>>

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
    private sandboxService: SandboxAPIService
  ) {

  }

  ngOnInit(): void {

    this.formDiagnostic = this.formBuilder.group({
      diagnosticId: ["", Validators.compose([Validators.required])],
      diagnosticName: [""],
      code: [""],
      diagnosticType: ["", Validators.compose([Validators.required])],
      observation: [""]
    })


    this.diagnosticTypes = [
      {
        id: "PRESUNTIVO",
        name: "Presuntivo"
      },
      {
        id: "DEFINITIVO",
        name: "Definitivo"
      }
    ]

    this.formDiagnostic.get("code").disable()

    this.diagnostics$ = this.sandboxService.findAll<DiagnosticModel>(DiagnosticModel)
  }

  ngOnDestroy(): void {

  }

  diagnosticSelect(row: any): void {

    const diagnostic = <DiagnosticModel>row

    this.diagnosticSelected = diagnostic

    this.formDiagnostic.get("code").setValue(diagnostic.code)
    this.formDiagnostic.get("diagnosticName").setValue(diagnostic.name)
  }

  addDiagnostic(): void {
    this.activeModal.close(this.formDiagnostic.getRawValue())
  }
}
