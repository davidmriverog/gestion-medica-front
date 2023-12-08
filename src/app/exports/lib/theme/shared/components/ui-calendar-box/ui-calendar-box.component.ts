import { BsLocaleService } from "ngx-bootstrap/datepicker"
import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ElementRef, ViewChild, Optional, Host, SkipSelf, OnDestroy, AfterViewInit } from "@angular/core"
import { NG_VALUE_ACCESSOR, AbstractControl, ControlContainer, FormGroup, ControlValueAccessor, FormBuilder } from "@angular/forms"
import { Subscription } from "rxjs"

import * as moment from "moment-timezone"
import { convertUTCDate } from "src/app/exports/lib"

@Component({
  selector: "ui-calendar-box",
  templateUrl: "./ui-calendar-box.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UICalendarBoxComponent),
      multi: true
    }
  ]
})
export class UICalendarBoxComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

  control: AbstractControl

  @Input()
  debounceInput = 0

  @Input()
  placeholder: string = ""

  @Input()
  value: Date

  @Input()
  disabled = false

  @Input()
  formControlName: string

  @Input()
  minDate: Date

  @Input()
  maxDate: Date

  @Input("group")
  formGroup: FormGroup

  @Output()
  input: EventEmitter<any> = new EventEmitter()

  isDebouncing = false
  @ViewChild("innerInput", { static: true })
  innerInput: ElementRef

  es: any

  dates: Date[]

  formDateGroup: FormGroup

  private internalSubcription: Array<Subscription> = new Array<Subscription>()

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService
  ) {
    this.formDateGroup = this.formBuilder.group({
      dates: [null]
    })
  }

  ngOnInit(): void {

    if (this.formControlName && this.controlContainer) {
      this.control = this.controlContainer.control.get(this.formControlName)
    }

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: "Hoy",
      clear: "Borrar"
    }

    this.internalSubcription.push(this.formDateGroup.get("dates").valueChanges.subscribe((dates: Date[]) => {
      this.registerOnTouched()


      if (dates != null && dates.length > 0) {
        const utcDates = dates.map(r => moment.utc(r.toISOString()).startOf("day").toDate())

        this.propagateChange(utcDates)

      } else {
        this.propagateChange([])
      }

    }))


  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy(): void {
    if (this.internalSubcription.length > 0) {
      this.internalSubcription.map((r) => r.unsubscribe())
    }
  }

  propagateChange = (_: any) => { }

  registerOnChange(fn) {
    this.propagateChange = fn
  }

  convertDates(values: any[]): Date[] {

    const dates = values ? values.map((r) => convertUTCDate(r)) : []

    return dates
  }

  writeValue(values: Date[]) {

    if (values != null && values.length > 0) {
      this.dates = values
      this.formDateGroup.get("dates").setValue(values)
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled
  }

  registerOnTouched() { }

  focus(): void {
    this.innerInput.nativeElement.focus()
  }

  onChange(valueDate: Array<Date>) {
    let myDates: Array<Date> = new Array<Date>()

    if (valueDate.length > 0) {
      myDates = valueDate.map(r => moment.utc(r).startOf("days").toDate())
    }

    this.propagateChange(myDates)
  }
}
