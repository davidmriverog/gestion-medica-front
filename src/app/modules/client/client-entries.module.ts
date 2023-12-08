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


@NgModule({
  declarations: [

  ],
  entryComponents: [

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
export class ClientEntriesModule { }
