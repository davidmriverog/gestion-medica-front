import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ListboxModule } from "primeng/listbox"
import { TabViewModule } from "primeng/tabview"
import { DragDropModule } from "primeng/dragdrop"
import { NgxPermissionsModule } from "ngx-permissions"
import { AutoCompleteModule } from "primeng/autocomplete"
import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap"

import { SharedModule } from "../../exports/lib"

import { MyComponentModule } from "../../components/component.module"

import { ImportDiagnosticModalComponent } from "./modals/import-diagnostic-modal/import-diagnostic-modal.component"
import { PrescriptionFormModalComponent } from "./modals/import-prescription-modal/import-prescription-modal.component"
import { AttentionProcedureDocumentFormModalComponent } from "./attention-procedures-form/modals/attention-procedure-document-modal.component"
import { AttentionProceduresDocumentModalComponent } from "./attention-procedures-form-detail/modals/attention-procedures-documents-modal.component"


@NgModule({
  declarations: [
    ImportDiagnosticModalComponent,
    PrescriptionFormModalComponent,
    AttentionProceduresDocumentModalComponent,
    AttentionProcedureDocumentFormModalComponent
  ],
  entryComponents: [
    ImportDiagnosticModalComponent,
    PrescriptionFormModalComponent,
    AttentionProceduresDocumentModalComponent,
    AttentionProcedureDocumentFormModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    SharedModule,
    ListboxModule,
    TabViewModule,
    DragDropModule,
    AutoCompleteModule,
    NgxPermissionsModule.forChild(),
    MyComponentModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ActEntriesModule { }
