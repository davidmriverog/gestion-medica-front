import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from '../../../exports/lib';

import { SysResourceModel } from 'src/app/project/models/sys/sys-resource.model';

@Component({
  selector: 'resource-form',
  templateUrl: './resource-form.component.html'
})
export class ResourceFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService);
    this.modelClass = SysResourceModel;

    this.controls = {
      [this.modelIdPropertyName]: [''],
      code: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      createdAt: ['']
    };
  }

  onInit(): void {
    //
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as SysResourceModel;
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model);

    return modelCasted;
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as SysResourceModel;
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date();
    return modelCasted;
  }
}
