import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { ListboxModule } from "primeng/listbox"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { NgxMaskModule } from "ngx-mask"
import { NgxPermissionsModule } from "ngx-permissions"
import { NgWizardModule, NgWizardConfig, THEME } from "ng-wizard"
import { DragDropModule } from "primeng/dragdrop"
import { SharedModule } from "../../exports/lib"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { NgxSpinnerModule } from "ngx-spinner"

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
}

import { RoutingModule } from "./client.routes"

import { MyComponentModule } from "../../components/component.module"
import { ClientDataComponent } from "./client-data/client-data.component"
import { ReservationListsComponent } from "./reservations/reservations.component"
import { TableModule } from "primeng/table"


@NgModule({
  declarations: [
    ClientDataComponent,
    ReservationListsComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ListboxModule,
    TableModule,
    NgxPermissionsModule.forChild(),
    NgxMaskModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
    NgxSpinnerModule,
    DragDropModule,
    SharedModule,
    MyComponentModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ClientModule {
  //
}
