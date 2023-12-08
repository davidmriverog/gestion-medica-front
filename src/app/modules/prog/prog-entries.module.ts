import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';

import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../exports/lib';

import { ReprogrammingModalComponent } from './reprogramming/reprogramming-modal.component';

import { MyComponentModule } from '../../components/component.module';

@NgModule({
  declarations: [
    ReprogrammingModalComponent
  ],
  entryComponents: [
    ReprogrammingModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    SharedModule,
    ListboxModule,
    MyComponentModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProgEntriesModule { }
