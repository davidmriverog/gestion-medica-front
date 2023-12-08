import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ListboxModule } from "primeng/listbox"
import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap"

import { SharedModule } from "../../exports/lib"

import { AccountingPeriodFormComponent } from "./accounting-periods/accounting-period-form.component"
import { MovementFormComponent } from "./movements/movement-form.component"
import { CurrencyFormComponent } from "./currencies/currency-form.component"

@NgModule({
  declarations: [
    MovementFormComponent,
    AccountingPeriodFormComponent,
    CurrencyFormComponent
  ],
  entryComponents: [
    MovementFormComponent,
    AccountingPeriodFormComponent,
    CurrencyFormComponent
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
export class AcEntriesModule { }
