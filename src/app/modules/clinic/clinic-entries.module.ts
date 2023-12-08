import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ListboxModule } from "primeng/listbox"
import { TabViewModule } from "primeng/tabview"
import { DragDropModule } from "primeng/dragdrop"
import { NgxPermissionsModule } from "ngx-permissions"
import { AutoCompleteModule } from "primeng/autocomplete"
import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap"

import { SharedModule } from "../../exports/lib"

import { MyComponentModule } from "../../components/component.module"

import { SpecialityFormComponent } from "./specialities/speciality-form.component"
import { DiagnosticFormComponent } from "./diagnostic/diagnostic-form.component"
import { MedicineFormComponent } from "./medicines/medicine-form.component"
import { MedicalStudentFormComponent } from "./medical-students/medical-student-form.component"
import { MedicalOfficeFormComponent } from "./medical-offices/medical-office-form.component"
import { PatientFormComponent } from "./patients/patient-form.component"
import { DoctorFormComponent } from "./doctors/doctor-form.component"
import { ImportDiagnosticComponent } from "./diagnostic/import-diagnostic.component"
import { MedicalOfficeImportComponent } from "./medical-offices/medical-office-import.component"
import { DoctorImportComponent } from "./doctors/doctor-import.component"
import { PatientImportComponent } from "./patients/patient-import.component"
import { SpecialityImportComponent } from "./specialities/speciality-import.component"

@NgModule({
  declarations: [
    SpecialityFormComponent,
    DiagnosticFormComponent,
    MedicineFormComponent,
    MedicalStudentFormComponent,
    MedicalOfficeFormComponent,
    PatientFormComponent,
    DoctorFormComponent,
    ImportDiagnosticComponent,
    MedicalOfficeImportComponent,
    DoctorImportComponent,
    PatientImportComponent,
    SpecialityImportComponent
  ],
  entryComponents: [
    SpecialityFormComponent,
    DiagnosticFormComponent,
    MedicineFormComponent,
    MedicalStudentFormComponent,
    MedicalOfficeFormComponent,
    PatientFormComponent,
    DoctorFormComponent,
    ImportDiagnosticComponent,
    MedicalOfficeImportComponent,
    DoctorImportComponent,
    PatientImportComponent,
    SpecialityImportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    SharedModule,
    ListboxModule,
    TabViewModule,
    DragDropModule,
    AutoCompleteModule,
    NgxPermissionsModule.forChild(),
    MyComponentModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ClinicEntriesModule { }
