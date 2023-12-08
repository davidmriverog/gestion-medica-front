import { Routes, RouterModule, Route } from "@angular/router"
import { ModuleWithProviders } from "@angular/core"
import { AuthGuard } from "../../exports/lib"

import { AttentionHistoriesComponent } from "./attention-histories/attention-histories.component"
import { AttentionConsultationFormComponent } from "./attention-consultation-form/attention-consultation-form.component"
import { AttentionConsultationFormDetailComponent } from "./attention-consultation-form-detail/attention-consultation-form-detail.component"
import { AttentionProcedureFormComponent } from "./attention-procedures-form/attention-procedures-form.component"
import { AttentionProceduresFormDetailComponent } from "./attention-procedures-form-detail/attention-procedures-form-detail.component"

const routes: Routes = [
  {
    path: "attention-history-lists",
    component: AttentionHistoriesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "attention-consultation-form/:detailId",
    component: AttentionConsultationFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "attention-procedure-form/:detailId",
    component: AttentionProcedureFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "attention-consultation-form-detail/:id",
    component: AttentionConsultationFormDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "attention-procedure-form-detail/:id",
    component: AttentionProceduresFormDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "attention-history-lists" }
]

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes)
