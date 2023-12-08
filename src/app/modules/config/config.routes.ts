import { Routes, RouterModule, Route } from "@angular/router"
import { ModuleWithProviders } from "@angular/core"
import { AuthGuard } from "../../exports/lib"

import { DocumentTypeListComponent } from "./document-types/document-types.component"
import { ClientInfoComponent } from "./client-info/client-info.component"

const routes: Routes = [
  {
    path: "document-types",
    component: DocumentTypeListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "client-info",
    component: ClientInfoComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "document-types" }
]

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes)
