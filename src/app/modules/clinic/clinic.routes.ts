import { Routes, RouterModule, Route } from "@angular/router"
import { ModuleWithProviders } from "@angular/core"
import { AuthGuard } from "../../exports/lib"

import { MedicalOfficeListComponent } from "./medical-offices/medical-offices.component"
import { SpecialitiesListComponent } from "./specialities/specialities.component"
import { PatientListsComponent } from "./patients/patients.component"
import { DoctorListsComponent } from "./doctors/doctors.component"
import { DiagnosticsListComponent } from "./diagnostic/diagnostics.component"

import { MedicinesListComponent } from "./medicines/medicines.component"
import { MedicalStudentListComponent } from "./medical-students/medical-students.component"

const routes: Routes = [
  {
    path: "medical-offices",
    component: MedicalOfficeListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "patients",
    component: PatientListsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "doctors",
    component: DoctorListsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "specialities",
    component: SpecialitiesListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "diagnostics",
    component: DiagnosticsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "medicines",
    component: MedicinesListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "medical-students",
    component: MedicalStudentListComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "doctor-offices" }
]

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes)
