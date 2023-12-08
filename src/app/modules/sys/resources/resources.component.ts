import { Component, ViewChild } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";

import { SysResourceModel } from "src/app/project/models/sys/sys-resource.model";

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from '../../../exports/lib';

import { ResourceFormComponent } from './resource-form.component';

@Component({
  selector: 'sys-resources',
  templateUrl: './resources.component.html'
})
export class ResourceListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

  records$: Observable<IAPIRecords<SysResourceModel[]>>;

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService);

    this.modelClass = SysResourceModel;

    this.crudFormClass = ResourceFormComponent;
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing();
  }

  onRefresh(criteria: IApiCriteria) {

    this.records$ = this.sandboxService.listPage(SysResourceModel, criteria);
  }
}