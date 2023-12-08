import { Component, ViewChild, OnInit, AfterViewInit, AfterContentInit } from "@angular/core"
import { FormBuilder, FormArray } from "@angular/forms"
import { Input, forwardRef, Optional, Host, SkipSelf } from "@angular/core"
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup, ControlValueAccessor } from "@angular/forms"

import { ToastrService } from "ngx-toastr"
import { Store } from "@ngrx/store"

import * as moment from "moment-timezone"
import * as _ from "lodash"
import * as UUID from "uuid"

import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Calendar, createDuration, OptionsInput, View } from "@fullcalendar/core"
import { FullCalendar } from "primeng/fullcalendar"

import {
  IAppState,
  IContextService,
  SandboxAPIService
} from "../../../../exports/lib"


import { PlanningMedicalCouponTurnService } from "src/app/project/services/prog/planning-medical-coupon-turn.service"

@Component({
  selector: "ui-calendar-coupons",
  templateUrl: "./ui-calendar-coupons.component.html",
  styleUrls: ["./ui-calendar-coupons.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UICalendarCouponComponent),
      multi: true
    }
  ],
  // encapsulation: ViewEncapsulation.None
})
export class UICalendarCouponComponent implements ControlValueAccessor, OnInit, AfterViewInit, AfterContentInit {

  interval: number = 30

  control: AbstractControl

  @Input()
  formControlName: string

  @Input()
  medicalOfficeId: string

  @Input()
  disabled = false

  @Input("group")
  formGroup: FormGroup

  @ViewChild("fullCalendar", { static: false })
  fullCalendar: FullCalendar

  calendar: Calendar
  options: OptionsInput
  eventsData: Array<any> = new Array<any>()

  isExistsCoupons: boolean = false

  @Input()
  attentionDate: string

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private sandboxService: SandboxAPIService,
    private planningMedicalCouponTurnService: PlanningMedicalCouponTurnService
  ) {

    if (this.formControlName && this.controlContainer) {
        this.control = this.controlContainer.control.get(this.formControlName)
    }

  }

  ngOnInit(): void {

    this.attentionDate = moment.utc(this.formGroup.get("date").value).format("YYYY-MM-DD")

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locale: "es",
      defaultView: "timeGridDay",
      selectable: true,
      allDaySlot: false,
      defaultDate: this.attentionDate,
      slotLabelFormat: [
        {
          hour: "numeric",
          minute: "numeric"
        }
      ],
      minTime: "00:00",
      maxTime: "23:59",
      select: ((arg) => {
        const eventId = UUID.v1()
        this.confirmAttention(arg.start, arg.end, eventId)
      }),
      eventClick: (arg) => {

        if (arg.event.id && !arg.event.extendedProps.readOnly) {

          // console.log("myConsole", arg.event)

          let index = this.eventsData.indexOf(arg.event)

          this.eventsData.splice(index, 1)

          this.deleteCoupons(arg.event.id)

         this.fullCalendar.getCalendar().getEventById(arg.event.id).remove()

         this.fullCalendar.getCalendar().refetchEvents()


          this.reOrderCoupons()
        } else {
          this.toastr.error(`No se pueden eliminar cupos ya generados en otras programaciones.`, "Atención")
          return
        }
      }
    }


  }

  propagateChange = (_: any) => { }

  registerOnChange(fn) {
    this.propagateChange = fn
  }

  writeValue(value: Date[]) {

    if (value != null) {

    }
  }

  setDisabledState(isDisabled: boolean) {
      this.disabled = isDisabled
  }

  registerOnTouched() { }

  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {
    this.listCouponByMedicalOfficeAndDates()
  }

  changeInterval(): void {
    this.calendar.setOption("defaultTimedEventDuration", createDuration(Number(this.interval), "minutes"))
    this.calendar.setOption("slotDuration", createDuration(Number(this.interval), "minutes"))
  }

  confirmAttention(start: Date, end: Date, eventId: string): void {

    const startHour = moment(new Date(start)).format("HH:mm")
    let endHour = moment(new Date(end)).format("HH:mm")

    this.eventsData = [...this.eventsData, {
      id: eventId,
      title: `Cupos ${startHour} - ${endHour}`,
      start: start,
      end: end,
      readOnly: false
    }]

    this.setIntervalTickets(start, end, this.interval, eventId)
  }

  private setIntervalTickets(start: Date, end: Date, times: number, eventId: string): void {

    const check = moment().startOf("days").format("HH:mm")

    let oneStartDate = moment(new Date(start)).format("HH:mm")
    let oneEndDate = moment(new Date(end)).format("HH:mm")

    let intervalTimes: Array<{ title: string, start: string, end: string }> = []

    const startDate = moment(new Date(start))
    const endDate = moment(new Date(end))

    let startEnd = startDate.clone()
    let auxEnd = startDate.add(times, "minutes")

    do {

      let auxEndStr = auxEnd.format("HH:mm")

      if (auxEndStr == check) {
        auxEndStr = "23:59"
      }

      intervalTimes.push({
        title: `${startEnd.format("HH:mm")} - ${auxEnd.format("HH:mm")}`,
        start: startEnd.format("HH:mm"),
        end: auxEndStr
      })

      // add
      startEnd.add(times, "minutes")
      auxEnd.add(times, "minutes")

    } while (auxEnd.toDate() <= endDate.toDate())

    const details = <FormArray>this.formGroup.get("coupons")

    if (intervalTimes.length > 1) {

      intervalTimes.map((item) => {

        details.push(this.formBuilder.group({
          _id: [""],
          title: [item.title],
          start: [item.start],
          end: [item.end],
          eventId: eventId,
          isAvailable: [true],
          invoiceDetailId: [null],
          isAtented: [false],
          attentionDate: [null]
        }))
      })
    } else {

      details.push(this.formBuilder.group({
        _id: [""],
        title: [`${oneStartDate} - ${oneEndDate}`],
        eventId: eventId,
        start: oneStartDate,
        end: oneEndDate == check ? "23:59" : oneEndDate,
        isAvailable: [true],
        invoiceDetailId: [null],
        isAtented: [false],
        attentionDate: [null]
      }))
    }

    this.reOrderCoupons()
  }

  protected reOrderCoupons(): void {

    const details = <FormArray>this.formGroup.get("coupons")

    const couponSorts = _.sortBy(details.value, (r) => {

      const currentDate = moment(this.attentionDate).format("YYYY-MM-DD")

      const startHour = moment(currentDate)
        .startOf("days")
        .set("hours", r.start.toString().substring(0, 2))
        .set("minutes", r.start.toString().substring(3, 5))
        .set("seconds", 0)

      const endtHour = moment(currentDate)
        .startOf("days")
        .set("hours", r.end.toString().substring(0, 2))
        .set("minutes", r.end.toString().substring(3, 5))
        .set("seconds", 0)

      return [startHour, endtHour]
    })

    details.clear()

    couponSorts.map((item) => {

      details.push(this.formBuilder.group({
        _id: [item._id],
        title: [item.title],
        start: [item.start],
        end: [item.end],
        eventId: [item.eventId],
        isAvailable: [item.isAvailable],
        invoiceDetailId: [item.invoiceDetailId],
        isAtented: [item.isAtented],
        attentionDate: [item.attentionDate]
      }))
    })
  }

  deleteCoupons(eventId: string): void {

    for (let control of (<FormArray>this.formGroup.get("coupons")).controls) {
      if (control instanceof FormGroup) {

        if (control.get("eventId").value == eventId) {

          let index = (<FormArray>this.formGroup.get("coupons")).controls.indexOf(control)

          this.removeItemCoupon(index, eventId)
        }
      }
    }

  }

  removeItemCoupon(index: number, eventId: string): void {
    const details = <FormArray>this.formGroup.get("coupons")

    if (index > -1) {
      (<FormArray>this.formGroup.get("coupons")).removeAt(index)

      const isContainEventId = details.value.find(r => r.eventId == eventId)

      if (isContainEventId) {
        this.deleteCoupons(eventId)
      }
    }
  }

  listCouponByMedicalOfficeAndDates(): void {


    this.planningMedicalCouponTurnService.listCouponByMedicalOfficeAndDates({
      attentionDate: this.attentionDate,
      medicalOfficeId: this.medicalOfficeId
    }).subscribe((results) => {

      if (results.length > 0) {
        this.isExistsCoupons = true

        const groupByEvents: Array<any> = _.groupBy(results, "eventId")

        const listEntries: Array<any> = Object.keys(groupByEvents)

        listEntries.forEach((eventId) => {

          const events: Array<any> = groupByEvents[eventId]

          const startMinHour = _.min(events.map(r => r.start.toString().substring(0, 2)))
          const startMaxHour = _.max(events.map(r => r.end.toString().substring(0, 2)))

          const couponStart = events.find(r => r.start.toString().substring(0, 2) == startMinHour)
          const couponEnd = events.find(r => r.end.toString().substring(0, 2) == startMaxHour)

          const currentDate = moment(this.attentionDate).format("YYYY-MM-DD")

          const startMin = couponStart.start.toString().substring(3, 5)
          const starHour = (startMinHour == 0 && startMin == 0)
          ? moment(`${currentDate} ${startMinHour}:01:00`).toDate()
          : moment(`${currentDate} ${startMinHour}:${startMin}:00`).toDate()

          const endMin = couponEnd.end.toString().substring(3, 5)
          const endHour = (startMaxHour == 0 && endMin == 0)
          ? moment(`${currentDate} ${startMinHour}:59:00`).toDate()
          : moment(`${currentDate} ${startMaxHour}:${endMin}:00`).toDate()

          this.eventsData = [...this.eventsData, {
            id: eventId,
            title: `Cupos ${startMinHour}:${startMin} - ${startMaxHour}:${endMin}`,
            start: starHour,
            end: endHour,
            readOnly: true,
            allDay: false
          }]

        })

        // coupons add
        const details = <FormArray>this.formGroup.get("coupons")

        results.map((item) => {

          details.push(this.formBuilder.group({
            _id: [item._id],
            title: [item.title],
            start: [item.start],
            end: [item.end],
            eventId: [item.eventId],
            saleDetailId: [item.saleDetailId],
            planningTurnStatusId: [item.saleDetailId],
            planningMedicalTurnId: [item.planningMedicalTurnId]
          }))
        })

        this.reOrderCoupons()
      } else {
        this.isExistsCoupons = true
      }
    })
  }

}
