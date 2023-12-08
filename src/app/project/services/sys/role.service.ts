import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"

import { BaseService, IContextService } from "../../../exports/lib"
import { environment } from "../../../../environments/environment"

import { SysRoleModel } from "../../models/sys/sys-role.model"

@Injectable({
  providedIn: "root"
})
export class RoleService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService)

    this.modelClass = SysRoleModel
  }

  updatePermissionRoles(userId: string, payload: { permissions: string[] }): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/permission/${userId}`, payload)
  }
}
