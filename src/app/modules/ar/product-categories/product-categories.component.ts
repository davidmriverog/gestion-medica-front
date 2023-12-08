import { Component, ViewChild } from "@angular/core"
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from "rxjs"

import { AdminListPage, IContextService, IApiCriteria, IAPIRecords, SandboxAPIService, UIAdminTableComponent } from '../../../exports/lib'

import { ProductCategoryFormComponent } from "./product-category-form.component"

import { ProductCategoryModel } from "../../../project/models/ar/product-category.model"

@Component({
  selector: 'product-categories',
  templateUrl: './product-categories.component.html'
})
export class ProductCategoriesComponent extends AdminListPage {

  @ViewChild(UIAdminTableComponent, { static: true }) adminTable: UIAdminTableComponent

  records$: Observable<IAPIRecords<ProductCategoryModel[]>>

  constructor(
    private modalService: NgbModal,
    private contextService: IContextService,
    private sandboxService: SandboxAPIService
  ) {
    super(modalService, contextService, sandboxService)

    this.modelClass = ProductCategoryModel

    this.crudFormClass = ProductCategoryFormComponent
  }

  onInit(): void {
    //
  }

  onRealTimeUpdate(): void {
    this.adminTable.refreshing()
  }

  onRefresh(criteria: IApiCriteria) {
    this.records$ = this.sandboxService.listPage(ProductCategoryModel, criteria)
  }
}
