import { Component, ViewChild } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from '../../../exports/lib';

import { RolesFormComponent } from './roles-form.component';

import { SysRoleModel } from "src/app/project/models/sys/sys-role.model";
import { Router } from "@angular/router";

@Component({
  selector: 'sys-roles',
  templateUrl: './roles.component.html'
})
export class RoListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

  records$: Observable<IAPIRecords<SysRoleModel[]>>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService);

    this.modelClass = SysRoleModel;

    this.crudFormClass = RolesFormComponent;
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing();
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(SysRoleModel, criteria);
  }

  goPermission(row: any): void {
    this.router.navigate(["/sys/role-permissions/", row._id])
  }
}
