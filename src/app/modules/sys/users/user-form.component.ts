import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoleEnum } from 'src/app/core/enums/sys/rol-values.enum';
import { tap } from 'rxjs/operators';

import { addCustomError, AdminCrudForm, CoreBaseModel, SandboxAPIService } from '../../../exports/lib';
import { SysRoleModel } from 'src/app/project/models/sys/sys-role.model';
import { SysUserModel } from 'src/app/project/models/sys/sys-user.model';


@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AdminCrudForm {

  roles$: Observable<Array<SysRoleModel>>;

  hiddenPassword: boolean = false;

  roleEnum = RoleEnum;

  roleSelected: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sandboxService: SandboxAPIService
  ) {
    super(formBuilder, toastr, sandboxService);
    this.modelClass = SysUserModel;

    this.controls = {
      [this.modelIdPropertyName]: [''],
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [''],
      confirmPassword: ['', Validators.compose([this.checkConfirmedPassword.bind(this)])],
      doctorId: [''],
      staffId: [''],
      patientId: [''],
      roleId: ['', Validators.compose([Validators.required])],
      active: [true],
      createdAt: ['']
    };
  }

  onInit(): void {
    this.roles$ = this.sandboxService.findAll<SysRoleModel>(SysRoleModel).pipe(
      tap((roles) => {
        this.formGroup.get('roleId').setValue(roles[0]._id);

        this.roleSelected = roles[0].code;
      })
    );
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as SysUserModel;

    if (modelCasted && modelCasted.getIdentity() != '') {
      this.formGroup.get('password').clearValidators();
      this.formGroup.get('confirmPassword').clearValidators();
      this.formGroup.get('roleId').clearValidators();

      this.hiddenPassword = true;

    } else {
      this.formGroup.get('password').setValidators([Validators.compose([Validators.required])]);
      this.formGroup.get('password').updateValueAndValidity();

      this.hiddenPassword = false;
    }
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model);

    return modelCasted;
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as SysUserModel;
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date();
    return modelCasted;
  }

  private checkConfirmedPassword(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.value) {
      return null;
    }

    if (this.formGroup.get('password').value !== this.formGroup.get('confirmPassword').value) {
      return addCustomError('confirmPassword', 'Ambas contraseña deben coincidir.', control);
    }

    return null;
  }

  selectRole(role: SysRoleModel): void {
    this.roleSelected = role.code;

    switch (role.code) {
      case RoleEnum.Medical:

        this.formGroup.get('staffId').clearValidators();

        this.formGroup.get('doctorId').setValidators([Validators.compose([Validators.required])]);
        this.formGroup.get('doctorId').updateValueAndValidity();

        break;
      case RoleEnum.Admin:

        this.formGroup.get('doctorId').clearValidators();

        this.formGroup.get('staffId').setValidators([Validators.compose([Validators.required])]);
        this.formGroup.get('staffId').updateValueAndValidity();

        break;
      case RoleEnum.RootAdmin:

        this.formGroup.get('doctorId').clearValidators();

        this.formGroup.get('staffId').setValidators([Validators.compose([Validators.required])]);
        this.formGroup.get('staffId').updateValueAndValidity();

        break;

      default:
        break;
    }
  }
}
