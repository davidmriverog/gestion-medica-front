import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbDropdownModule, NgbModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxSpinnerModule } from 'ngx-spinner';

import {
  AdminComponent,
  ChatMsgComponent,
  ChatUserListComponent,
  ConfigurationComponent,
  FriendComponent,
  NavBarComponent,
  NavCollapseComponent,
  NavContentComponent,
  NavGroupComponent,
  NavigationComponent,
  NavItemComponent,
  NavLeftComponent,
  NavRightComponent,
  NavSearchComponent,
  SharedModule
} from '../exports/lib';
import { MyComponentModule } from "../components/component.module";

import { RoutingModule } from './modules.routes';

import { SysEntriesModule } from './sys/sys-entries.module';
import { ClinicEntriesModule } from './clinic/clinic-entries.module';
import { ConfigEntriesModule } from './config/config-entries.module';
import { ArEntriesModule } from "./ar/ar-entries.module";
import { AcEntriesModule } from "./ac/ac-entries.module";
import { ClientEntriesModule } from "./client/client-entries.module";
import { MsEntriesModule } from './ms/ms-entries.module';
import { ProgEntriesModule } from './prog/prog-entries.module';
import { ActEntriesModule } from './act/act-entries.module';
import { ProfileEntriesModule } from "./profile/profile-entries.module";

@NgModule({
  declarations: [
    AdminComponent,
    NavigationComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    NavLeftComponent,
    NavSearchComponent,
    NavRightComponent,
    ChatUserListComponent,
    FriendComponent,
    ChatMsgComponent,
    ConfigurationComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    MyComponentModule,
    NgxPermissionsModule.forChild(),
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    NgxSpinnerModule,
    SysEntriesModule,
    ClinicEntriesModule,
    ConfigEntriesModule,
    ArEntriesModule,
    AcEntriesModule,
    ClientEntriesModule,
    MsEntriesModule,
    ProgEntriesModule,
    ActEntriesModule,
    ProfileEntriesModule
  ],
  exports: [
    //
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModules {

}
