import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { shareReplay, switchMap, delay, finalize, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';

import { IContextService, IAppState, getClientInfo, getCurrency, handleFile } from '../../../exports/lib';
import { PlanningTurnStatusEnum } from '../../../core/enums/prog/planning-turn-states.enum';

import { ReprogrammingModalComponent } from '../../prog/reprogramming/reprogramming-modal.component';

import { SaleService } from '../../../project/services/ms/sale.service';
import { PlanningMedicalCouponTurnService } from '../../../project/services/prog/planning-medical-coupon-turn.service';
import { RoleEnum } from 'src/app/core/enums/sys/rol-values.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'sale-detail',
  templateUrl: './sale-detail.component.html'
})
export class SaleDetailComponent implements OnInit {

  saleId: string;

  saleInfo$: Observable<any>;

  clientInfo$ = this.store.pipe(
    select(getClientInfo)
  );

  currency$ = this.store.pipe(
    select(getCurrency)
  );

  planningTurnStatusEnum = PlanningTurnStatusEnum;

  saleInfo: any;
  roleEnum = RoleEnum;

  constructor(
    private modalServies: NgbModal,
    private engineService: SaleService,
    private contextService: IContextService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private store: Store<IAppState>,
    private planningTurnCouponService: PlanningMedicalCouponTurnService,
    private location: Location
  ) {

  }

  ngOnInit(): void {

    this.fetching();
  }


  redirectToHistories(): void {
    this.location.back()
  }

  modalReprogramming(row: any): void {

    const modalReprogrammingTurn = this.modalServies.open(ReprogrammingModalComponent, <NgbModalOptions>{
      windowClass: 'xl-modal',
      backdrop: 'static'
    });

    // inject
    modalReprogrammingTurn.componentInstance.doctorId = row.coupon.planningMedicalTurn.doctorId;
    modalReprogrammingTurn.componentInstance.planningMedicalCouponTurnId = row.coupon._id;
    modalReprogrammingTurn.componentInstance.saleDetailId = row._id;
    modalReprogrammingTurn.componentInstance.productCategoryId = row.product.productCategoryId;
    modalReprogrammingTurn.componentInstance.specialityId = row.coupon.planningMedicalTurn.specialityId;

    modalReprogrammingTurn.result.then((selection: any) => {

      if (selection != null) {
        this.confirmReprogramming(row.coupon._id, row._id, selection);
      }
    }, (reason) => {
      console.log('reason', reason);
    });
  }

  confirmReprogramming(planningMedicalCouponTurnId: string, saleDetailId: string, row: any): void {

    const titleMessage: string = `Reprogramar cita al día ${moment(new Date(row.attentionDate)).format('DD-MM-YYYY')} hora ${row.start} médico ${row.doctor.firstName} ${row.doctorFullName} consultorio ${row.medicalOffice.officeName}`;
    const contentMessage: string = `¿Esta seguro de realizar esta operación?, Una vez hecha esta operación no se podrá revertir.`;

    Swal.fire({
      title: titleMessage,
      text: contentMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Si, Cambiar.`,
      cancelButtonText: 'No!',
      reverseButtons: true,
      backdrop: true
    }).then((result) => {
      if (result.value) {

        this.contextService.startLoading();

        this.planningTurnCouponService.reProgrammingMedicalTurn({
          saleDetailId: saleDetailId,
          from: planningMedicalCouponTurnId,
          to: row.planningMedicalCouponTurnId
        }).subscribe((response) => {

          Swal.fire(
            'Éxito',
            'Proceso realizado exitosamente',
            'success'
          );

          this.fetching();

          this.contextService.stopLoading();
        }, (err) => {
          this.toastr.error('Ha ocurrido un error, intente más tarde.', 'Error');
          this.contextService.stopLoading();
        });

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

        Swal.fire(
          'Operación cancelada',
          'has cancelado la operación',
          'error'
        );
      }
    });
  }

  protected fetching(): void {
    this.saleInfo$ = this.route.params.pipe(
      switchMap((param) => {
        this.saleId = param['id'];
        return this.engineService.info(param['id']);
      }),
      tap((result) => {

        this.saleInfo = result;
      }),
      shareReplay()
    );
  }

  deleteSales(): void {
    const couponAttended = _.filter(this.saleInfo.details, (r) => r.coupon.planningTurnStatusId == PlanningTurnStatusEnum.Attended);

    if (couponAttended.length > 0) {
      this.toastr.error('No se puede anular esta venta ya que posee cita(s) atendida(s)!', 'Atención!', {
        extendedTimeOut: 4000
      });
      return;
    }

    Swal.fire({
      title: `Anular venta`,
      text: `Esta seguro de realizar esta operación, le advertimos que esta operación no podrá revertirse.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Si, Anular.`,
      cancelButtonText: 'No!',
      reverseButtons: true,
      backdrop: true
    }).then((result) => {
      if (result.value) {

        this.contextService.startLoading();

        this.engineService.annulment(this.saleId).pipe(
          finalize(() => {
            this.contextService.stopLoading();
          })
        ).subscribe((response) => {

          Swal.fire(
            'Éxito',
            'Proceso realizado exitosamente',
            'success'
          );

          this.redirectToHistories();

        }, (err) => {
          this.toastr.error('Ha ocurrido un error, intente más tarde.', 'Error');
        });


      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

        Swal.fire(
          'Operación cancelada',
          'has cancelado la operación',
          'error'
        );
      }
    });
  }

  print(): void {

    this.contextService.startLoading();

    const printName: string = `reserva-cita-${moment().format('YYYYMMDDHHmmss')}`;

    this.engineService.print(this.saleId).pipe(
      delay(1000),
      finalize(() => {
        this.contextService.stopLoading();
      })
    ).subscribe((result: Blob) => handleFile(result, printName));
  }

}
