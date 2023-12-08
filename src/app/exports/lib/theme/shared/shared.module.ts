import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"


import { DataFilterPipe } from "./components/data-table/data-filter.pipe"
import { TodoListRemoveDirective } from "./components/todo/todo-list-remove.directive"
import { TodoCardCompleteDirective } from "./components/todo/todo-card-complete.directive"
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from "ngx-perfect-scrollbar"
import { DataTablesModule } from "angular-datatables"
import { NgbButtonsModule, NgbDropdownModule, NgbModule, NgbTabsetModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap"
import { ClickOutsideModule } from "ng-click-outside"
import { NgxSpinnerModule } from "ngx-spinner"
import { NgxMaskModule } from "ngx-mask"
import { CalendarModule } from "primeng/calendar"
import { AutoCompleteModule } from "primeng/autocomplete"
import { AngularEditorModule } from "@kolkov/angular-editor"
import { NgxDropzoneModule } from "ngx-dropzone"
import { TableModule } from "primeng/table"

import { NgxCurrencyModule } from "ngx-currency"
import { NgSelectModule } from "@ng-select/ng-select"
import { defineLocale, esUsLocale } from "ngx-bootstrap/chronos"
import { BsDatepickerModule } from "ngx-bootstrap/datepicker"
import { NgxPermissionsModule } from "ngx-permissions"
import { EditorModule } from "@tinymce/tinymce-angular"
import { CKEditorModule } from "@ckeditor/ckeditor5-angular"
import { ColorPickerModule } from "primeng/colorpicker"
import { FileUploadModule } from "primeng/fileupload"

import { SpinnerComponent } from "./components/spinner/spinner.component"
import { ApexChartComponent } from "./components/chart/apex-chart/apex-chart.component"
import { ApexChartService } from "./components/chart/apex-chart/apex-chart.service"
import { ToastComponent } from "./components/toast/toast.component"
import { ToastService } from "./components/toast/toast.service"
import { GalleryComponent } from "./components/gallery/gallery.component"
import { LightboxModule } from "ngx-lightbox"
import { UIDatatableComponent } from "./components/ui-datatable/ui-datatable.component"
import { UILabelComponent } from "./components/ui-label/ui-label.component"
import { UIModalFormComponent } from "./components/ui-modal-form/ui-modal-form.component"
import { UITextBoxComponent } from "./components/ui-text-box/ui-text-box.component"
import { UIValidatorsComponent } from "./components/ui-validators/ui-validators.component"
import { UICurrencyBoxComponent } from "./components/ui-currency-box/ui-currency-box.component"
import { UITextAreaComponent } from "./components/ui-text-area/ui-text-area.component"
import { UIPasswordBoxComponent } from "./components/ui-password-box/ui-password-box.component"
import { UIFormRadioComponent } from "./components/ui-form-radio/ui-form-radio.component"
import { UIFormMaskComponent } from "./components/ui-form-mask/ui-form-mask.component"
import { UIFormDateComponent } from "./components/ui-form-date/ui-form-date.component"
import { UIFormDateRangerComponent } from "./components/ui-form-date-ranger/ui-form-date-ranger.component"
import { BaseFilter } from "./components/ui-filters/base-filter.class"
import { UIFilterTextComponent } from "./components/ui-filters/ui-filter-text/ui-filter-text.component"
import { UIModalFilterDatatableComponent } from "./components/ui-datatable/modals/ui-modal-filter-datatable.component"
import { UINumberBoxComponent } from "./components/ui-number-box/ui-number-box.component"
import { UIDropdownComponent } from "./components/ui-dropdown/ui-dropdown.component"
import { UICheckBoxComponent } from "./components/ui-check-box/ui-check-box.component"
import { UIFileUpload } from "./components/ui-file-upload/ui-file-upload.component"

import { AlertModule } from "./components/alert/alert.module"
import { CardModule } from "./components/card/card.module"
import { BreadcrumbModule } from "./components/breadcrumb/breadcrumb.module"
import { ModalModule } from "./components/modal/modal.module"

import { UIEditorBoxComponent } from "./components/ui-editor-box/ui-editor-box.component"
import { UIFilterDateComponent } from "./components/ui-filters/ui-filter-date/ui-filter-date.component"
import { UICalendarBoxComponent } from "./components/ui-calendar-box/ui-calendar-box.component"
import { UIColorBoxComponent } from "./components/ui-color-box/ui-color-box.component"
import { UIProgressingBarComponent } from "./components/progressing-bar/progressing-bar.component"
import { UIAdminTableComponent } from "./components/ui-admin-table/ui-admin-table.component"
import { UIModalFilterTableComponent } from "./components/ui-admin-table/modals/ui-modal-filter-table.component"
import { UtcDatePipe } from "../../pipes/utc-date.pipe"

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
}

@NgModule({
  declarations: [
    UtcDatePipe,
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    SpinnerComponent,
    ApexChartComponent,
    ToastComponent,
    GalleryComponent,
    UIDatatableComponent,
    UILabelComponent,
    UIModalFormComponent,
    UITextBoxComponent,
    UIValidatorsComponent,
    UICurrencyBoxComponent,
    UITextAreaComponent,
    UIPasswordBoxComponent,
    UIFormRadioComponent,
    UIFormMaskComponent,
    UIFormDateComponent,
    UINumberBoxComponent,
    UIDropdownComponent,
    UICheckBoxComponent,
    UIEditorBoxComponent,
    UICalendarBoxComponent,
    UIColorBoxComponent,
    UIProgressingBarComponent,
    UIFileUpload,

    // FILTERS
    BaseFilter,
    UIFilterTextComponent,
    UIFilterDateComponent,
    UIFormDateRangerComponent,
    UIModalFilterDatatableComponent,
    UIModalFilterTableComponent,
    UIAdminTableComponent
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    BreadcrumbModule,
    ModalModule,
    NgbModule,
    ClickOutsideModule,
    LightboxModule,
    DataTablesModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    NgxSpinnerModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxCurrencyModule,
    AutoCompleteModule,
    EditorModule,
    CKEditorModule,
    CalendarModule,
    ColorPickerModule,
    AngularEditorModule,
    NgxDropzoneModule,
    FileUploadModule,
    TableModule
  ],
  entryComponents: [
    UIModalFilterDatatableComponent,
    UIModalFilterTableComponent
  ],
  exports: [
    UtcDatePipe,
    AlertModule,
    CardModule,
    BreadcrumbModule,
    ModalModule,
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    ClickOutsideModule,
    SpinnerComponent,
    ApexChartComponent,
    GalleryComponent,
    ToastComponent,
    UILabelComponent,
    UIModalFormComponent,
    UITextBoxComponent,
    UIValidatorsComponent,
    UIDatatableComponent,
    UICurrencyBoxComponent,
    UITextAreaComponent,
    UIPasswordBoxComponent,
    UIFormRadioComponent,
    UIFormMaskComponent,
    UIFormDateComponent,
    UIFormDateRangerComponent,
    BaseFilter,
    UIFilterTextComponent,
    UIFilterDateComponent,
    UINumberBoxComponent,
    UIDropdownComponent,
    UICheckBoxComponent,
    UIEditorBoxComponent,
    UICalendarBoxComponent,
    UIColorBoxComponent,
    UIProgressingBarComponent,
    UIFileUpload,
    UIAdminTableComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ApexChartService,
    ToastService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule {
  constructor() {
    defineLocale("es-us", esUsLocale)
  }
}
