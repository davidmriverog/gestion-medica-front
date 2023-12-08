import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ListboxModule } from "primeng/listbox"

import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap"

import { SharedModule } from "../../exports/lib"

import { MyComponentModule } from "../../components/component.module"

import { RolesFormComponent } from "./roles/roles-form.component"
import { UserFormComponent } from "./users/user-form.component"
import { StaffFormComponent } from "./staffs/staff-form.component"
import { ResourceFormComponent } from "./resources/resource-form.component"
import { PermissionFormComponent } from "./permissions/permission-form.component"

@NgModule({
  declarations: [
    UserFormComponent,
    RolesFormComponent,
    StaffFormComponent,
    ResourceFormComponent,
    PermissionFormComponent
  ],
  entryComponents: [
    RolesFormComponent,
    UserFormComponent,
    StaffFormComponent,
    ResourceFormComponent,
    PermissionFormComponent
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
export class SysEntriesModule { }
