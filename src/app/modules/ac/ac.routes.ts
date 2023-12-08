import { Routes, RouterModule, Route } from "@angular/router"
import { ModuleWithProviders } from "@angular/core"
import { AuthGuard } from "../../exports/lib"

import { MovementListComponent } from "./movements/movements.component"
import { AccountingPeriodListComponent } from "./accounting-periods/accounting-periods.component"
import { CurrenciesComponent } from "./currencies/currencies.component"

const routes: Routes = [
  {
    path: "accounting-periods",
    component: AccountingPeriodListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "movements",
    component: MovementListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "currencies",
    component: CurrenciesComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "accounting-periods" }
]

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes)
