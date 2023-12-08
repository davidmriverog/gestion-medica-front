import { Component, ViewChild } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from '../../../exports/lib';

import { PermissionFormComponent } from './permission-form.component';
import { SysPermissionModel } from "src/app/project/models/sys/sys-permission.model";

@Component({
    selector: 'sys-permissions',
    templateUrl: './permissions.component.html'
})
export class PermissionListComponent extends AdminListPage {

    @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

    records$: Observable<IAPIRecords<SysPermissionModel[]>>;

    constructor(
        private modalService: NgbModal,
        private contextService: IContextService,
        private sandboxService: SandboxAPIService
    ) {
        super(modalService, contextService, sandboxService);

        this.modelClass = SysPermissionModel;

        this.crudFormClass = PermissionFormComponent;
    }

    onInit(): void {
        //
    }

    onRealTimeUpdate(): void {
        this.adminTable.refreshing();
    }

    onRefresh(criteria: IApiCriteria) {
        
        this.records$ = this.sandboxService.listPage(SysPermissionModel, criteria);
    }
}