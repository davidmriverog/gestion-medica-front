import { Component, ViewChild } from "@angular/core";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { finalize, takeUntil } from "rxjs/operators";
import { Router } from '@angular/router';
import { GenderEnum } from "src/app/core/enums/mat/gender.enum";

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent, handleFile } from '../../../exports/lib';


import { SaleModel } from "src/app/project/models/sm/sale.model";
import { SaleService } from "src/app/project/services/ms/sale.service";

@Component({
  selector: 'reservations',
  templateUrl: './reservations.component.html'
})
export class ReservationListsComponent extends AdminListPage {

  genderEnum = GenderEnum;

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent;

  records$: Observable<IAPIRecords<SaleModel[]>>;

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private saleService: SaleService,
    private toastr: ToastrService,
    private router: Router
  ) {
    super(modalService, contextService, sandboxService);

    this.modelClass = SaleModel;
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing();
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.saleService.listPaginateHistoryClient(criteria)
  }

  print(row: any): void {

    this.contextService.startLoading();

    const printName: string = `reserva-cita-${moment().format('YYYYMMDDHHmmss')}`;

    this.saleService.print(row._id).pipe(
      finalize(() => {
        this.contextService.stopLoading();
      })
    ).subscribe((result: Blob) => handleFile(result, printName))
  }

  goDetail(id: string): void {
      this.router.navigate(['/ms/sale-detail', id]);
  }

}
