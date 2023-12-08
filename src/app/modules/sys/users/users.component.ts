import { Component, ViewChild } from "@angular/core"
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"
import { takeUntil } from "rxjs/operators"
import { RoleEnum } from "src/app/core/enums/sys/rol-values.enum"
import { SysUserModel } from "src/app/project/models/sys/sys-user.model"
import { SysUserService } from "src/app/project/services/sys/sys-user.service"

import Swal from "sweetalert2"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from "../../../exports/lib"

import { UserFormComponent } from "./user-form.component"

@Component({
  selector: "sys-users",
  templateUrl: "./users.component.html"
})
export class UserListComponent extends AdminListPage {

  roleEnum = RoleEnum

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<SysUserModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService,
    private userService: SysUserService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = SysUserModel

    this.crudFormClass = UserFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(SysUserModel, criteria)
  }

  newUser(): void {

    this.createModal(null, <NgbModalOptions>{
      windowClass: "xl-modal",
      backdrop: "static"
    })
  }

  editUser(row: any): void {

    this.editModal(row, <NgbModalOptions>{
      size: "lg",
      backdrop: "static"
    })
  }

  lockedUser(id: string, action: boolean = true, user: any): void {

    let label = action ? "Bloquear" : "Desbloquear"

    Swal.fire({
      title: `${label} Usuario ${user.username}`,
      text: `¿Esta seguro de realizar esta operación?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Procesar",
      cancelButtonText: "No!",
      reverseButtons: true,
      backdrop: true
    }).then((result) => {
      if (result.value) {

        this._contextService.startLoading()

        this.userService.lockedUser(id, action).pipe(
          takeUntil(this.destroyed$)
        ).subscribe((response) => {

          Swal.fire(
            "Proceso exitoso",
            "Operación aplicada de manera exitosa!",
            "success"
          )

          this.onRealTimeUpdate()

          this._contextService.stopLoading()
        })

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

        Swal.fire(
          "Operación cancelada",
          "has cancelado la operación",
          "error"
        )
      }
    })

  }
}
