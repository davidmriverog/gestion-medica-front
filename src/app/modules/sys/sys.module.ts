import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { ListboxModule } from "primeng/listbox"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { TableModule } from "primeng/table"
import { PickListModule } from "primeng/picklist"

import { SharedModule } from "../../exports/lib"

import { MyComponentModule } from "../../components/component.module"

import { RoutingModule } from "./sys.routes"

import { RoListComponent } from "./roles/roles.component"
import { UserListComponent } from "./users/users.component"
import { StaffsComponent } from "./staffs/staffs.component"
import { ResourceListComponent } from "./resources/resources.component"
import { PermissionListComponent } from "./permissions/permissions.component"
import { RolePermissionEditComponent } from "./roles/role-permissions.component"


@NgModule({
  declarations: [
    RoListComponent,
    RolePermissionEditComponent,
    UserListComponent,
    StaffsComponent,
    ResourceListComponent,
    PermissionListComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    PickListModule,
    ReactiveFormsModule,
    ListboxModule,
    SharedModule,
    TableModule,
    MyComponentModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class SysModule {
  //
}
