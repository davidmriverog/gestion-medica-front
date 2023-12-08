import { Component, OnInit, Input, Output, EventEmitter, forwardRef, Optional, Host, SkipSelf } from "@angular/core"
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ControlContainer, AbstractControl, FormGroup } from "@angular/forms"

@Component({
  selector: "ui-dropdown",
  templateUrl: "./ui-dropdown.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIDropdownComponent),
      multi: true
    }
  ]
})
export class UIDropdownComponent implements ControlValueAccessor, OnInit {
  control: AbstractControl

  @Input()
  selectedValue: any

  @Input()
  disabled: boolean = false
  @Input()
  placeholder = ""
  @Input()
  items: Array<any> = []
  @Input()
  bindValue: string
  @Input()
  bindLabel: string
  @Input()
  multiple: boolean = false
  @Input()
  formControlName: string
  @Input("group")
  formGroup: FormGroup
  @Input()
  virtualScroll: boolean = false

  @Output()
  change: EventEmitter<any> = new EventEmitter()

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer
  ) { }

  ngOnInit() {
    if (this.formControlName && this.controlContainer) this.control = this.controlContainer.control.get(this.formControlName)
  }

  propagateChange = (_: any) => { }

  registerOnChange(fn) {
    this.propagateChange = fn
  }

  writeValue(value: Array<any>) {
    this.selectedValue = value
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled
  }

  registerOnTouched() { }

  onChange(event: any) {
    this.change.emit(event)
    this.propagateChange(this.selectedValue)
  }
}
