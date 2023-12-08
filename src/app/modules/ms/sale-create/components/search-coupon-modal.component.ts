import { Component, OnDestroy, OnInit, Input, AfterContentInit } from "@angular/core"
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { ToastrService } from "ngx-toastr"
import { Observable, of, Subscription } from "rxjs"
import { finalize, map, switchMap, delay } from "rxjs/operators"
import * as _ from "lodash"
import * as moment from "moment-timezone"

import { DoctorService } from "../../../../project/services/clinic/doctor.service"
import { SpecialityService } from "../../../../project/services/clinic/speciality.service"
import { ProductService } from "../../../../project/services/ar/product.service"

import { ProductModel } from "../../../../project/models/ar/product.model"
import { DoctorModel } from "../../../../project/models/clinic/doctor.model"
import { SpecialityModel } from "../../../../project/models/clinic/speciality.model"

import { getCurrency, IAppState, validateAllFormFields, SandboxAPIService } from "../../../../exports/lib"

import { PlanningMedicalCouponTurnService } from "../../../../project/services/prog/planning-medical-coupon-turn.service"
import { PlanningMedicalTurnService } from "../../../../project/services/prog/planning-medical-turn.service"

import { select, Store } from "@ngrx/store"

@Component({
    selector: "search-coupon-modal",
    templateUrl: "./search-coupon-modal.component.html"
})
export class SearchCouponModalComponent implements OnInit, OnDestroy, AfterContentInit {

    @Input()
    patientId: string
    patientName: string

    selected: Array<any>

    formSearchGroup: FormGroup

    specialities$: Observable<Array<SpecialityModel>>
    products$: Observable<Array<ProductModel>>
    doctors$: Observable<Array<DoctorModel>>

    minDate: Date = new Date()

    resultSearchs$: Observable<Array<any>>

    isSearching: boolean = false

    selecteds: Array<any> = new Array<any>()
    productName: string

    private unSubcription: Array<Subscription> = Array<Subscription>()

    currency$ = this.store.pipe(
        select(getCurrency)
    )

    customTitle$: Observable<string> = of("Cargando...")

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private store: Store<IAppState>,
        private specialityService: SpecialityService,
        private productService: ProductService,
        private doctorService: DoctorService,
        private sandboxService: SandboxAPIService,
        private planningTurnMedicalService: PlanningMedicalTurnService,
        private planningTurnCouponService: PlanningMedicalCouponTurnService
    ) {

    }

    ngOnInit(): void {

        this.customTitle$ = this.currency$.pipe(
            map((currency) => `Precio del producto (${currency.symbol})`)
        )

        this.formSearchGroup = this.formBuilder.group({
            patientReservationId: ["", Validators.compose([Validators.required])],
            specialityId: ["", Validators.compose([Validators.required])],
            productId: ["", Validators.compose([Validators.required])],
            productCategoryId: ["", Validators.compose([Validators.required])],
            productCategoryName: [""],
            price: ["", Validators.compose([Validators.required])],
            dateRanger: [[], Validators.compose([Validators.required])],
            doctors: [[]],
            results: this.formBuilder.array([])
        })

        this.formSearchGroup.get("productCategoryName").disable()
        this.formSearchGroup.get("price").disable()

        this.specialities$ = this.sandboxService.findAll<SpecialityModel>(SpecialityModel)
        this.products$ = this.formSearchGroup.get("specialityId").valueChanges.pipe(
            switchMap((specialityId) => {
                return this.productService.productListBySpecialityId(specialityId)
            })
        )

        this.doctors$ = this.formSearchGroup.get("specialityId").valueChanges.pipe(
            switchMap((specialityId) => {

                this.formSearchGroup.get("doctors").setValue([])

                return this.doctorService.findDoctorBySpeciality(specialityId)
            })
        )
    }

    ngOnDestroy(): void {

        if (this.unSubcription.length > 0) {
            this.unSubcription.map(r => r.unsubscribe())
        }
    }

    ngAfterContentInit(): void {
        if (this.patientId) {
            this.formSearchGroup.get("patientReservationId").setValue(this.patientId)
        }
    }

    patientSelect(row: any) {
        this.patientName = `${row.firstName}, ${row.firstSurname}`
    }

    selectItems(event, row): void {
        //this.selected = event

        if (event.target.checked) {
            const isElement = this.selecteds.find(r => r._id == row._id)

            if (!isElement) {

                // validamos que este cargado el producto.
                if (this.formSearchGroup.get("productId").value != null && this.formSearchGroup.get("productId").value != "") {

                    this.selecteds.push(Object.assign(row, {}, {
                        productId: this.formSearchGroup.get("productId").value,
                        patientReservationId: this.formSearchGroup.get("patientReservationId").value,
                        productName: this.productName,
                        price: this.formSearchGroup.get("price").value
                    }))
                } else {

                    this.toastr.error("Atención!", "Seleccione por favor el producto.")

                    event.target.checked = false
                }
            }
        } else {
            let find = this.selecteds.find(r => r._id == row._id)
            let indexOf = this.selecteds.indexOf(find)

            this.selecteds.splice(indexOf, 1)
        }
    }

    import(): void {
        const details = <FormArray>this.formSearchGroup.get("results")

        if (this.formSearchGroup.invalid) {
            this.toastr.error("Atención!", "Hay campos que faltan por llenar")

            validateAllFormFields(this.formSearchGroup)
            return
        }

        const progWithSelectedCoupons = _.filter(details.value, (r) => r.planningMedicalCouponTurnId != "")

        if (progWithSelectedCoupons.length == 0) {
            this.toastr.error("Atención!", "Seleccione al menos un cupo a reservar..")
            return
        }

        progWithSelectedCoupons.map((r) => {

            this.selecteds.push(Object.assign(r, {}, {
                productId: this.formSearchGroup.get("productId").value,
                productName: this.productName,
                patientName: this.patientName,
                patientReservationId: this.formSearchGroup.get("patientReservationId").value,
                price: this.formSearchGroup.get("price").value
            }))
        })

        this.activeModal.close(this.selecteds)
    }

    singleSelected(row: any): void {
        this.activeModal.close(row)
    }

    productSelected(product: ProductModel): void {
        if (product) {
            this.productName = product.name
            this.formSearchGroup.get("productCategoryId").setValue(product.productCategoryId)
            this.formSearchGroup.get("productCategoryName").setValue(product.productCategory.name)
            this.formSearchGroup.get("price").setValue(product.price)
        } else {

            this.formSearchGroup.get("productCategoryId").setValue(null)
            this.formSearchGroup.get("productCategoryName").setValue(null)
            this.formSearchGroup.get("price").setValue(0)
        }
    }

    search(): void {

        if (this.formSearchGroup.get("specialityId").invalid) {
            this.toastr.error("Atención!", "Por favor, elije la especialidad")

            validateAllFormFields(this.formSearchGroup)
            return
        }

        if (this.formSearchGroup.get("productId").invalid) {
            this.toastr.error("Atención!", "Por favor, elije el producto")

            validateAllFormFields(this.formSearchGroup)
            return
        }

        const doctors: Array<any> = this.formSearchGroup.get("doctors").value
        const rangeDates: Array<Date> = this.formSearchGroup.get("dateRanger").value

        if (rangeDates.length == 0) {
            this.toastr.error("Atención!", "Por favor, seleccione el rango de fecha")

            validateAllFormFields(this.formSearchGroup)
            return
        }

        this.isSearching = true

        const details = <FormArray>this.formSearchGroup.get("results")

        details.clear()

        this.unSubcription.push(this.planningTurnMedicalService.findProgrammingCouponAvailableSales({
            specialityId: this.formSearchGroup.get("specialityId").value,
            productCategoryId: this.formSearchGroup.get("productCategoryId").value,
            dateRanger: rangeDates.length > 0 ? rangeDates : [],
            doctors: doctors.length > 0 ? doctors : []
        }).pipe(
            delay(500),
            finalize(() => {
                this.isSearching = false
            })
        ).subscribe((results) => {
            if (results.length > 0) {

                results.map((item) => {

                    const couponSorts = _.sortBy(item.coupons, (r) => {
                        const startHour = moment(new Date(item.attentionDate))
                            .set("hours", r.start.toString().substring(0, 2))
                            .set("minutes", r.start.toString().substring(3, 5))
                            .set("seconds", 0)

                        const endtHour = moment(new Date(item.attentionDate))
                            .set("hours", r.end.toString().substring(0, 2))
                            .set("minutes", r.end.toString().substring(3, 5))
                            .set("seconds", 0)

                        return [startHour, endtHour]
                    })

                    details.push(this.formBuilder.group({
                        _id: [item._id],
                        active: [item.active],
                        accountingPeriodId: [item.accountingPeriodId],
                        attentionDate: [item.attentionDate],
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
                        planningMedicalCouponTurnId: [""],
                        planningMedicalCouponTurnTitle: [""]
                    }))
                })


            }
        }))

    }

    selectedCoupon(event: any, item: FormGroup, i: number): void {

        item.get("planningMedicalCouponTurnTitle").setValue(event.title)
    }
}
