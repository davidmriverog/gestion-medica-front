import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from '../../../exports/lib';

import { GenderEnum } from '../../../core/enums/mat/gender.enum';
import { StaffModel } from 'src/app/project/models/sys/staff.model';
import { DocumentTypeModel } from 'src/app/project/models/config/document-type.model';

@Component({
  selector: 'staff-form-component',
  templateUrl: './staff-form.component.html'
})
export class StaffFormComponent extends AdminCrudForm {

  maskDocumentNumber: string = '00.000.000';
  documentTypeSelected: DocumentTypeModel;

  documentTypes$: Observable<Array<DocumentTypeModel>>;

  genderEnum = GenderEnum;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService);
    this.modelClass = StaffModel;

    this.controls = {
      [this.modelIdPropertyName]: [''],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      documentTypeId: ['', Validators.compose([Validators.required])],
      documentNumber: ['', Validators.compose([Validators.required])],
      birthDate: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      emailAddress: ['', Validators.compose([Validators.required, Validators.email])],
      cellphone: ['', Validators.compose([Validators.required])],
      addresses: ['', Validators.compose([Validators.required])],
      active: [true],
      createdAt: ['']
    };

  }

  onInit(): void {
    this.documentTypes$ = this.sandboxService.findAll<DocumentTypeModel>(DocumentTypeModel);
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as StaffModel;
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model);

    return modelCasted;
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as StaffModel;
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date();
    return modelCasted;
  }

  onDocumentTypeSelected(documentTypeSelected: DocumentTypeModel): void {

    this.documentTypeSelected = documentTypeSelected;

    this.maskDocumentNumber = documentTypeSelected.mask;

    this.formGroup.get('documentNumber').enable();
    this.formGroup.get('documentNumber').setValue('');
  }

}
