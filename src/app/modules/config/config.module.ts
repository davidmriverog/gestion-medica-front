import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { ListboxModule } from "primeng/listbox"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { TableModule } from "primeng/table"
import { SharedModule } from "../../exports/lib"

import { RoutingModule } from "./config.routes"

import { MyComponentModule } from "src/app/components/component.module"

import { DocumentTypeListComponent } from "./document-types/document-types.component"
import { ClientInfoComponent } from "./client-info/client-info.component"

@NgModule({
  declarations: [
    DocumentTypeListComponent,
    ClientInfoComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ListboxModule,
    SharedModule,
    MyComponentModule,
    TableModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ConfigModule {
  //
}
