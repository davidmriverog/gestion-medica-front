import { Routes, RouterModule, Route } from "@angular/router"
import { ModuleWithProviders } from "@angular/core"
import { AuthGuard } from "../../exports/lib"

import { ClientDataComponent } from "./client-data/client-data.component"
import { ReservationListsComponent } from "./reservations/reservations.component"


const routes: Routes = [
  {
    path: "client-data",
    component: ClientDataComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "reservations",
    component: ReservationListsComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "client-data" }
]

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes)
