import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { TabViewModule } from 'primeng/tabview';

import { SharedModule } from '../../exports/lib';

import { MyComponentModule } from '../../components/component.module';

import { RoutingModule } from './profile.routes';

import { ProfilePatientComponent } from './profile-patient/profile-patient.component';


@NgModule({
  declarations: [
    ProfilePatientComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ListboxModule,
    SharedModule,
    TableModule,
    FullCalendarModule,
    MyComponentModule,
    TabViewModule
  ],
  exports: [

  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ProfileModule {
  //
}
