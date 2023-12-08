import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';

import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../exports/lib';
import { ProfilePatientAffectionFormComponent } from './profile-patient/profile-patient-affection-form.component';

@NgModule({
  declarations: [
    ProfilePatientAffectionFormComponent
  ],
  entryComponents: [
    ProfilePatientAffectionFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileEntriesModule { }
