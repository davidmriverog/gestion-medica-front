import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ListboxModule } from "primeng/listbox"

import { SharedModule } from "../../exports/lib"

import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap"

import { DocumentTypeFormComponent } from "./document-types/document-type-form.component"

@NgModule({
  declarations: [
    DocumentTypeFormComponent
  ],
  entryComponents: [
    DocumentTypeFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    SharedModule,
    ListboxModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ConfigEntriesModule { }
