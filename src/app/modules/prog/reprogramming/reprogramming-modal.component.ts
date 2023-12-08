import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Observable, of, Subscription } from "rxjs";
import { finalize, map, switchMap, delay } from "rxjs/operators";
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import Swal from 'sweetalert2';
import { select, Store } from "@ngrx/store";

import { DoctorService } from "../../../project/services/clinic/doctor.service";
import { ProductService } from "../../../project/services/ar/product.service";

import { ProductModel } from "../../../project/models/ar/product.model";
import { DoctorModel } from "../../../project/models/clinic/doctor.model";
import { getCurrency, IAppState, validateAllFormFields } from "../../../exports/lib";
import { PlanningMedicalTurnService } from "../../../project/services/prog/planning-medical-turn.service";


@Component({
    selector: 'reprogramming-modal',
    templateUrl: './reprogramming-modal.component.html'
})
export class ReprogrammingModalComponent implements OnInit, OnDestroy {

    @Input()
    doctorId: string;

    @Input()
    specialityId: string;

    @Input()
    planningMedicalCouponTurnId: string;

    @Input()
    saleDetailId: string;

    @Input()
    productCategoryId: string;

    private unSubcription: Array<Subscription> = Array<Subscription>();

    couponResults$: Observable<Array<any>>;

    isSearching: boolean = false;

    minDate: Date;

    formSearchGroup: FormGroup;

    doctors$: Observable<Array<DoctorModel>>;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private store: Store<IAppState>,
        private doctorService: DoctorService,
        private planningTurnMedicalService: PlanningMedicalTurnService
    ) {

    }

    ngOnInit(): void {
        this.minDate = new Date();

        this.formSearchGroup = this.formBuilder.group({
            dateRanger: [[new Date(), new Date()]],
            doctors: [[]],
            results: this.formBuilder.array([])
        });

        this.doctors$ = this.doctorService.findDoctorBySpeciality(this.specialityId);

        //this.fetch();
    }

    fetch(): void {

        const doctors: Array<any> = this.formSearchGroup.get('doctors').value;
        const rangeDates: Array<Date> = this.formSearchGroup.get('dateRanger').value;

        if (rangeDates.length == 0) {
            this.toastr.error('Por favor elije un rango de fecha', 'Atención');
            return;
        }

        this.isSearching = true;

        const details = <FormArray>this.formSearchGroup.get('results');

        details.clear();

        this.unSubcription.push(this.planningTurnMedicalService.findProgrammingCouponAvailableSales({
            specialityId: this.specialityId,
            productCategoryId: this.productCategoryId,
            dateRanger: rangeDates.length > 0 ? rangeDates : [],
            doctors: doctors.length > 0 ? doctors : []
        }).pipe(
            delay(500),
            finalize(() => {
                this.isSearching = false;
            })
        ).subscribe((results) => {

            if (results.length > 0) {

                results.map((item) => {

                    const couponSorts = _.sortBy(item.coupons, (r) => {
                        const startHour = moment(new Date(item.attentionDate))
                            .set('hours', r.start.toString().substring(0, 2))
                            .set('minutes', r.start.toString().substring(3, 5))
                            .set('seconds', 0);

                        const endtHour = moment(new Date(item.attentionDate))
                            .set('hours', r.end.toString().substring(0, 2))
                            .set('minutes', r.end.toString().substring(3, 5))
                            .set('seconds', 0);

                        return [startHour, endtHour];
                    });

                    details.push(this.formBuilder.group({
                        _id: [item._id],
                        active: [item.active],
                        accountingPeriodId: [item.accountingPeriodId],
                        attentionDate: [item.attentionDate],
                        attentionDateStr: [item.attentionDateStr],
                        doctorId: [item.doctorId],
                        specialityId: [item.specialityId],
                        productCategoryId: [item.productCategoryId],
                        productCategory: [item.productCategory],
                        productCategoryName: [item.productCategory.name],
                        medicalOfficeId: [item.medicalOfficeId],
                        createdAt: [item.createdAt],
                        doctor: [item.doctor],
                        doctorFullName: [`${item.doctor.firstName} ${item.doctor.firstSurname}`],
                        speciality: [item.speciality],
                        specialityName: [`${item.speciality.name}`],
                        medicalOffice: [item.medicalOffice],
                        medicalOfficeName: [`${item.medicalOffice.officeName}`],
                        coupons: [couponSorts],
                        planningMedicalCouponTurnId: ['', Validators.required],
                        planningMedicalCouponTurnTitle: [''],
                        start: ['']
                    }));
                });


            }
        }));
    }

    confirm(row: any): void {
        this.activeModal.close(row);
    }

    ngOnDestroy(): void {

        if (this.unSubcription.length > 0) {
            this.unSubcription.map(r => r.unsubscribe());
        }
    }

    isDisableCoupon(item): boolean {

        return item.get('planningMedicalCouponTurnId').invalid;
    }


    selectedCoupon(event: any, item: FormGroup, i: number): void {

        item.get('planningMedicalCouponTurnTitle').setValue(event.title);
        item.get('start').setValue(event.start);
    }

    convertStrToDate(dateStr): string {

        const date = moment.utc(dateStr)

        return date.format("DD-MM-YYYY")
    }
}
