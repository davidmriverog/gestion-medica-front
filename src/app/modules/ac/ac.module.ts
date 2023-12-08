import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { ListboxModule } from "primeng/listbox"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { MyComponentModule } from "../../components/component.module"
import { TableModule } from "primeng/table"

import { SharedModule } from "../../exports/lib"

import { RoutingModule } from "./ac.routes"

import { MovementListComponent } from "./movements/movements.component"
import { AccountingPeriodListComponent } from "./accounting-periods/accounting-periods.component"
import { CurrenciesComponent } from "./currencies/currencies.component"

@NgModule({
  declarations: [
    MovementListComponent,
    AccountingPeriodListComponent,
    CurrenciesComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
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
export class AcModule {
  //
}
