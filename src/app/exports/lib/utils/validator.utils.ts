import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms'

export const numericPattern = '^[0-9]*$'

export const validateAllFormFields = (formGroup: AbstractControl | FormGroup | FormArray | FormControl) => {
  Object.keys((formGroup as FormGroup).controls).forEach(field => {
    const control = formGroup.get(field)

    if (control instanceof FormControl) {
      control.markAsTouched()

    } else if (control instanceof FormGroup) {
      validateAllFormFields(control)

    } else if (control instanceof FormArray) {
      control.markAsTouched()

      control.controls.forEach(elem => {
        validateAllFormFields(elem)
      })
    }
  })
}

export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl)
    if (validator && validator.required) {
      return true
    }
  }

  if (abstractControl['controls']) {

    for (const controlName in abstractControl['controls']) {

      if (abstractControl['controls'][controlName]) {

        if (hasRequiredField(abstractControl['controls'][controlName])) {
          return true
        }
      }
    }
  }
  return false
}

export const addCustomError = (errorName: string, message: string, control: AbstractControl) => {
  let customErrors: { [key: string]: string } = {}
  if (control.hasError('custom')) {
    customErrors = control.getError('custom')
  }
  let error = { custom: Object.assign({}, customErrors, { [errorName]: message }) }
  control.setErrors(Object.assign({}, control.errors, error))
  return { custom: Object.assign({}, customErrors, { [errorName]: message }) }
}
