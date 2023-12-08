import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ui-modal-form',
  templateUrl: './ui-modal-form.component.html'
})
export class UIModalFormComponent implements OnInit, OnDestroy {
  @Input()
  title: string;
  @Input()
  buttonClose: boolean;
  @Input()
  buttonSubmit: boolean;
  @Input()
  buttonCloseText: string;
  @Input()
  buttonSubmitText: string;
  @Input()
  formGroup: FormGroup;

  @Output()
  formSubmit = new EventEmitter<any>();
  @Output()
  formValidate = new EventEmitter<Array<{ key: string, message: string }>>();

  _processing: boolean;

  get processing() {
    return this._processing;
  }

  set processing(value) {
    this._processing = value;
  }

  _errorMessages: Array<{ key: string, message: string }> = new Array<{ key: string, message: string }>()

  get errorMessages() {
    return this._errorMessages
  }

  set errorMessages(errors: Array<{ key: string, message: string }>) {
    this._errorMessages = errors
  }

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  onSubmit(event: any) {

    if (this.formGroup.valid) {
      this.processing = true;
      this.formSubmit.emit(event);
    } else {
      this.formGroup.markAsTouched();
      this.updateFormValueAndValidityRecursively(this.formGroup);

      this._errorMessages = []

      Object.keys(this.formGroup.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.formGroup.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {

            console.log(keyError)

           let errorMessage = ""

           switch (keyError) {
             case "required":
               errorMessage = `es requerido`
               break;
             case "pattern":
               errorMessage = `posee un valor incorrecto.`
               break;
             case "email":
               errorMessage = `posee un formato incorrecto.`
               break;
           }

           this._errorMessages = [...this._errorMessages, {
             key: key,
             message: errorMessage
           }]
          });
        }
      });

      this.formValidate.emit(this.errorMessages);
    }
  }

  close() {
    this.processing = false;
    this.activeModal.close();
  }

  private updateFormValueAndValidityRecursively(control: AbstractControl) {
    if ((control as FormGroup).controls) {
      Object.keys((control as FormGroup).controls).map(key => {
        this.updateFormValueAndValidityRecursively((control as FormGroup).get(key));
      });
    } else {
      (control as FormControl).markAsDirty();
      (control as FormControl).updateValueAndValidity();
    }
  }
}
