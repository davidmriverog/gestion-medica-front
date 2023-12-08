import { Component, ViewChild } from "@angular/core"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { Observable } from "rxjs"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from "../../../exports/lib"

import { ProductFormComponent } from "./product-form.component"

import { ProductModel } from "src/app/project/models/ar/product.model"

@Component({
  selector: "products",
  templateUrl: "./products.component.html"
})
export class ProductsComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<ProductModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = ProductModel

    this.crudFormClass = ProductFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(ProductModel, criteria)
  }
}
