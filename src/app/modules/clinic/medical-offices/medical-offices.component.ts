import { Component, ViewChild } from "@angular/core";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { finalize, takeUntil } from "rxjs/operators";

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from '../../../exports/lib';

import { MedicalOfficeImportComponent } from "./medical-office-import.component";
import { MedicalOfficeFormComponent } from './medical-office-form.component';

import { MedicalOfficeModel } from "src/app/project/models/clinic/medical-office.model";
import { MedicalOfficeService } from "src/app/project/services/clinic/medical-office.service";

@Component({
  selector: 'medical-offices',
  templateUrl: './medical-offices.component.html'
})
export class MedicalOfficeListComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

  records$: Observable<IAPIRecords<MedicalOfficeModel[]>>;

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private engineService: MedicalOfficeService,
    private toastr: ToastrService
  ) {
    super(modalService, contextService, sandboxService);

    this.modelClass = MedicalOfficeModel;

    this.crudFormClass = MedicalOfficeFormComponent;
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing();
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(MedicalOfficeModel, criteria);
  }

  newMedicalOffice(): void {

    this.createModal(null, <NgbModalOptions>{
      size: 'lg'
    });
  }

  editMedicalOffice(row: any): void {

    this.editModal(row, <NgbModalOptions>{
      size: 'lg'
    });
  }

  download(): void {
    this.contextService.startLoading();

    const printName: string = `plantilla-consultorios-${moment().format('YYYYMMDDHHmmss')}`;

    this.engineService.download().pipe(
      takeUntil(this.destroyed$),
      finalize(() => this.contextService.stopLoading())
    ).subscribe((result: Blob) => handleFile(result, printName));

  }

  import(): void {
    const crudForm = this.setupModal(MedicalOfficeImportComponent, <NgbModalOptions>{
      size: 'lg'
    });
    
    crudForm.onResult.subscribe((result) => {

      this.toastr.success('Carga exitosa', 'Hemos realizado la carga de manera exitosa');

      this.onRealTimeUpdate();
    });
  }
}
