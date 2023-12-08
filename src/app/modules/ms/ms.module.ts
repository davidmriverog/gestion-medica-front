import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { TabViewModule } from 'primeng/tabview';

import { SharedModule } from '../../exports/lib';

import { MyComponentModule } from '../../components/component.module';

import { RoutingModule } from './ms.routes';

import { SaleCreateComponent } from './sale-create/sale-create.component';
import { SaleListsComponent } from './sales/sales.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';

@NgModule({
  declarations: [
    SaleCreateComponent,
    SaleListsComponent,
    SaleDetailComponent
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
export class MsModule {
  //
}
