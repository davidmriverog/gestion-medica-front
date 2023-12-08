import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { ListboxModule } from "primeng/listbox"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { FullCalendarModule } from "primeng/fullcalendar"
import { SharedModule } from "../../exports/lib"
import { MyComponentModule } from "../../components/component.module"
import { TableModule } from "primeng/table"

import { RoutingModule } from "./ar.routes"

import { ProductCategoriesComponent } from "./product-categories/product-categories.component"
import { ProductsComponent } from "./products/products.component"
import { PaymentConditionsComponent } from "./payment-conditions/payment-conditions.component"

@NgModule({
  declarations: [
    ProductCategoriesComponent,
    ProductsComponent,
    PaymentConditionsComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ListboxModule,
    SharedModule,
    FullCalendarModule,
    MyComponentModule,
    TableModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ArModule {
  //
}
