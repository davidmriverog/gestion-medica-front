import { Component, ViewChild } from "@angular/core";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from '../../../exports/lib';

import { StaffFormComponent } from './staff-form.component';

import { StaffModel } from "src/app/project/models/sys/staff.model";

@Component({
  selector: 'staffs',
  templateUrl: './staffs.component.html'
})
export class StaffsComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

  records$: Observable<IAPIRecords<StaffModel[]>>;

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService);

    this.modelClass = StaffModel;

    this.crudFormClass = StaffFormComponent;
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing();
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(StaffModel, criteria);
	}
	
	create(): void {
		this.createModal(null, <NgbModalOptions>{
			size: 'lg'
		});
	}

	edit(row: StaffModel): void {

		this.editModal(row, <NgbModalOptions>{
			size: 'lg'
		});
	}
}
