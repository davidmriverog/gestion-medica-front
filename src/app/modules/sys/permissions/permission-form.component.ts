import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AdminCrudForm, CoreBaseModel, SandboxAPIService } from '../../../exports/lib';
import { SysPermissionModel } from 'src/app/project/models/sys/sys-permission.model';
import { SysResourceModel } from 'src/app/project/models/sys/sys-resource.model';

@Component({
  selector: 'permission-form',
  templateUrl: './permission-form.component.html'
})
export class PermissionFormComponent extends AdminCrudForm {

  resources$: Observable<SysResourceModel[]>;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService);
    this.modelClass = SysPermissionModel;

    this.controls = {
      [this.modelIdPropertyName]: [''],
      code: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      resourceId: ['', Validators.compose([Validators.required])],
      createdAt: ['']
    };
  }

  onInit(): void {
    this.resources$ = this.sandboxService.findAll<SysResourceModel>(SysResourceModel);
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as SysPermissionModel;
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model);

    return modelCasted;
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as SysPermissionModel;
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date();
    return modelCasted;
  }
}
