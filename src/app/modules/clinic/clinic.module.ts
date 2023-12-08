import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { ListboxModule } from "primeng/listbox"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { NgxMaskModule } from "ngx-mask"
import { NgxPermissionsModule } from "ngx-permissions"
import { NgWizardModule, NgWizardConfig, THEME } from "ng-wizard"
import { DragDropModule } from "primeng/dragdrop"
import { SharedModule } from "../../exports/lib"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { TableModule } from "primeng/table"

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
}

import { RoutingModule } from "./clinic.routes"

import { MyComponentModule } from "../../components/component.module"

import { MedicalOfficeListComponent } from "./medical-offices/medical-offices.component"
import { SpecialitiesListComponent } from "./specialities/specialities.component"
import { PatientListsComponent } from "./patients/patients.component"
import { DoctorListsComponent } from "./doctors/doctors.component"
import { DiagnosticsListComponent } from "./diagnostic/diagnostics.component"
import { MedicinesListComponent } from "./medicines/medicines.component"
import { MedicalStudentListComponent } from "./medical-students/medical-students.component"

@NgModule({
  declarations: [
    SpecialitiesListComponent,
    MedicalOfficeListComponent,
    PatientListsComponent,
    DoctorListsComponent,
    DiagnosticsListComponent,
    MedicinesListComponent,
    MedicalStudentListComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ListboxModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    NgxMaskModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
    DragDropModule,
    MyComponentModule,
    TableModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ClinicModule {
  //
}
