import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { ListboxModule } from "primeng/listbox"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { NgxMaskModule } from "ngx-mask"
import { NgxPermissionsModule } from "ngx-permissions"
import { NgWizardModule, NgWizardConfig, THEME } from "ng-wizard"
import { DragDropModule } from "primeng/dragdrop"
import { SharedModule } from "../../exports/lib"
import { TableModule } from "primeng/table"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { TabViewModule } from "primeng/tabview"

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
}

import { RoutingModule } from "./act.routes"

import { MyComponentModule } from "../../components/component.module"

import { NgxSpinnerModule } from "ngx-spinner"

import { AttentionHistoriesComponent } from "./attention-histories/attention-histories.component"
import { AttentionConsultationFormComponent } from "./attention-consultation-form/attention-consultation-form.component"
import { AttentionConsultationFormDetailComponent } from "./attention-consultation-form-detail/attention-consultation-form-detail.component"
import { AttentionProcedureFormComponent } from "./attention-procedures-form/attention-procedures-form.component"
import { AttentionProceduresFormDetailComponent } from "./attention-procedures-form-detail/attention-procedures-form-detail.component"

@NgModule({
  declarations: [
    AttentionHistoriesComponent,
    AttentionConsultationFormComponent,
    AttentionConsultationFormDetailComponent,
    AttentionProcedureFormComponent,
    AttentionProceduresFormDetailComponent
  ],
  imports: [
    RoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ListboxModule,
    SharedModule,
    TableModule,
    MyComponentModule,
    NgxPermissionsModule.forChild(),
    NgxMaskModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
    NgxSpinnerModule,
    DragDropModule,
    TableModule,
    TabViewModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ActModule {
  //
}
