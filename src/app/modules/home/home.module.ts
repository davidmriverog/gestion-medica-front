import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '../../exports/lib';
import { NgbTabsetModule, NgbProgressbarModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MyComponentModule } from '../../components/component.module';

import { RoutingModule } from './home.routes';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardDoctorComponent } from './dashboard-doctor/dashboard-doctor.component';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { DashboardRecepcionistComponent } from './dashboard-receptionist/dashboard-receptionist.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardClientComponent,
    DashboardDoctorComponent,
    DashboardRecepcionistComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ListboxModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    NgbTabsetModule,
    NgbProgressbarModule,
    NgbPopoverModule,
    MyComponentModule,
    TableModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class HomeModule {
  //
}