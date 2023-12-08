import { Routes, RouterModule, Route } from "@angular/router"
import { ModuleWithProviders } from "@angular/core"
import { AuthGuard } from "../../exports/lib"

import { ProductCategoriesComponent } from "./product-categories/product-categories.component"
import { ProductsComponent } from "./products/products.component"
import { PaymentConditionsComponent } from "./payment-conditions/payment-conditions.component"

const routes: Routes = [
  {
    path: "products",
    component: ProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "product-categories",
    component: ProductCategoriesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "payment-conditions",
    component: PaymentConditionsComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "products" }
]

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes)
