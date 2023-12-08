import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ListboxModule } from "primeng/listbox"

import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap"

import { SharedModule } from "../../exports/lib"

import { ProductCategoryFormComponent } from "./product-categories/product-category-form.component"
import { ProductFormComponent } from "./products/product-form.component"
import { PaymentConditionFormComponent } from "./payment-conditions/payment-condition-form.component"

@NgModule({
  declarations: [
    ProductCategoryFormComponent,
    ProductFormComponent,
    PaymentConditionFormComponent
  ],
  entryComponents: [
    ProductCategoryFormComponent,
    ProductFormComponent,
    PaymentConditionFormComponent
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
export class ArEntriesModule { }
