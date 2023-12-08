import { Component } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { Store } from "@ngrx/store"

import * as _ from "lodash"

import { ActivatedRoute, Router } from "@angular/router"
import Swal from "sweetalert2"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"

import {
  IAppState,
  IContextService,
  validateAllFormFields,
  CoreBaseModel,
  getPeriod,
  checkUser,
  AdminCrudForm,
  SandboxAPIService,
} from "../../../exports/lib"

import { SysRoleModel } from "src/app/project/models/sys/sys-role.model"
import { Location } from "@angular/common"
import { combineLatest, Observable, Unsubscribable } from "rxjs"
import { filter, first, mergeMap, shareReplay } from "rxjs/operators"
import { SysPermissionModel } from "src/app/project/models/sys/sys-permission.model"
import { RoleService } from "src/app/project/services/sys/role.service"

@Component({
  selector: "role-permissions",
  templateUrl: "./role-permissions.component.html"
})
export class RolePermissionEditComponent extends AdminCrudForm {

  roleId: string

  role$: Observable<any>

  allPermissions: any[] = []
  sourcePermissions: any[] = []
  targetPermissions: any[] = []

  unSubscribeUpdateRole$: Unsubscribable

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private modalService: NgbModal,
    private sandboxService: SandboxAPIService,
    private location: Location,
    private roleService: RoleService
  ) {
    super(formBuilder, toastr, sandboxService)
    this.modelClass = SysRoleModel

    this.controls = {
      [this.modelIdPropertyName]: [""],
      permissions: this.formBuilder.array([]),
      createdAt: [""]
    }

  }

  onInit() {
    this.role$ = this.route.params.pipe(
      filter((param) => !!param["roleId"]),
      mergeMap((param) => {

        this.roleId = param["roleId"]

        return this.sandboxService.findById(SysRoleModel, param["roleId"])
      }),
      first(),
      shareReplay()
    )

    combineLatest([
      this.sandboxService.findAll<SysPermissionModel>(SysPermissionModel),
      this.role$
    ]).subscribe(([permissions, role]) => {

      this.allPermissions = permissions

      this.sourcePermissions = _.differenceWith(permissions, role.permissions, (arrVal, othVal) => arrVal._id === othVal)

      this.targetPermissions = role.permissions.map((r) => {

        const permission = permissions.find(x => x._id === r)

        return permission
      })
    })
  }

  onDestroy(): void {

    if (this.unSubscribeUpdateRole$) {

      this.unSubscribeUpdateRole$.unsubscribe()
    }
  }

  onPopulated(model: CoreBaseModel): void {
    const modelCasted = model as SysRoleModel
  }

  parseModel(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = Object.assign(new this.modelClass(), model)

    return modelCasted
  }

  setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    const modelCasted = model as SysRoleModel
    modelCasted.createdAt = modelCasted.createdAt ? modelCasted.createdAt : new Date()
    return modelCasted
  }

  goBack(): void {
    this.location.back()
  }

  async submit(event: any) {

    try {

      if (this.targetPermissions.length == 0) {
        this.toastr.error("Eliga por favor al menos un permiso para el rol.", "Ops!")

        validateAllFormFields(this.formGroup)
        return
      }

      if (this.formGroup.invalid) {

        this.toastr.error("Faltan campos por completar", "Ops!")

        validateAllFormFields(this.formGroup)
        return
      }

      Swal.fire({
        title: `Modificar permisos de roles`,
        text: `¿Esta seguro de realizar esta operación?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Editar",
        cancelButtonText: "No!",
        reverseButtons: true,
        backdrop: true
      }).then(async (result) => {
        if (result.value) {

          const model = Object.assign(new this.modelClass(), this.parseModel(this.formGroup.getRawValue() as CoreBaseModel))
          const modelCasted = this.setMandatoryFields(model)

          this.contextService.startLoading()

          this.unSubscribeUpdateRole$ = this.roleService.updatePermissionRoles(this.roleId, {
            permissions: this.targetPermissions.map((r) => r._id)
          }).subscribe((result) => {

            if (result) {

              this.contextService.stopLoading()
              this.goBack()
            }
          })

        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {

          Swal.fire(
            "Operación cancelada",
            "has cancelado la operación",
            "error"
          )
        }
      })

    } catch (error) {
      console.log(error)
    }
  }
}
