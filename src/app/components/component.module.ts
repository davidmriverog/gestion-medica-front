import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DataTablesModule } from 'angular-datatables';
import { NgbButtonsModule, NgbDropdownModule, NgbModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxMaskModule } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { NgxCurrencyModule } from 'ngx-currency';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LightboxModule } from 'ngx-lightbox';
import { FileUploadModule } from 'primeng/fileupload';

import { UIStaffBoxComponent } from './ui-staff-box/ui-staff-box.component';
import { UIPatientBoxComponent } from './ui-patient-box/ui-patient-box.component';
import { UIDoctorBoxComponent } from './ui-doctor-box/ui-doctor-box.component';
import { UIDiagnosticBoxComponent } from './ui-diagnostic-box/ui-diagnostic-box.component';
import { UIMedicineBoxComponent } from './ui-medicine-box/ui-medicine-box.component';
import { UIMedicalStudentBoxComponent } from './ui-medical-student-box/ui-medical-student-box.component';
import { UIFileBoxComponent } from './ui-file-box/ui-file-box.component';
import { UIClinicHistoryPatient } from './ui-clinic-history-patient/ui-clinic-history-patient.component';
import { CardModule, SharedModule } from '../exports/lib';

@NgModule({
  declarations: [
    UIStaffBoxComponent,
    UIPatientBoxComponent,
    UIDoctorBoxComponent,
    UIDiagnosticBoxComponent,
    UIMedicineBoxComponent,
    UIMedicalStudentBoxComponent,
    UIFileBoxComponent,
    UIClinicHistoryPatient
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ClickOutsideModule,
    LightboxModule,
    DataTablesModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    NgxSpinnerModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxCurrencyModule,
    AutoCompleteModule,
    EditorModule,
    CKEditorModule,
    CalendarModule,
    FileUploadModule,
    CardModule
  ],
  exports: [
    UIStaffBoxComponent,
    UIPatientBoxComponent,
    UIDiagnosticBoxComponent,
    UIMedicineBoxComponent,
    UIMedicalStudentBoxComponent,
    UIFileBoxComponent,
    UIDoctorBoxComponent,
    UIClinicHistoryPatient
  ],
  providers: [

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MyComponentModule {

}
