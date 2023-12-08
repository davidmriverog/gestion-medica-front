import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from '../../../exports/lib';
import { SysRoleModel } from 'src/app/project/models/sys/sys-role.model';

@Component({
  selector: 'roles-form',
  templateUrl: './roles-form.component.html'
})
export class RolesFormComponent extends AdminCrudForm {

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService);
    this.modelClass = SysRoleModel;

    this.controls = {
      [this.modelIdPropertyName]: [''],
      code: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      permissions: [[]],
      description: [''],
      createdAt: ['']
    };
  }

  onInit(): void {
    //
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as SysRoleModel;
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model);

    return modelCasted;
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as SysRoleModel;
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date();
    return modelCasted;
  }
}
