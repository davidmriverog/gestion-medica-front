import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { TabViewModule } from 'primeng/tabview';

import { SharedModule } from '../../exports/lib';

import { MyComponentModule } from '../../components/component.module';

import { RoutingModule } from './prog.routes';

import { PlanningTurnCreateComponent } from './planning-turn-create/planning-turn-create.component';
import { UICalendarCouponComponent } from './planning-turn-create/components/ui-calendar-coupons.component';
import { ProgramingTurnComponent } from './programming/programming.component';
import { ProgramingListComponent } from './programming/programming-list.component';
import { PlanningMedicalTurnDetailComponent } from './programming/programming-detail.component';


@NgModule({
  declarations: [
    PlanningTurnCreateComponent,
    UICalendarCouponComponent,
    ProgramingTurnComponent,
    ProgramingListComponent,
    PlanningMedicalTurnDetailComponent
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
    UICalendarCouponComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ProgModule {
  //
}
