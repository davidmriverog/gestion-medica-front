import { ToastrService } from 'ngx-toastr';

import { OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, AfterViewInit, Injectable, Directive } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { CoreBaseModel } from './core-base-model.class';

import { UIModalFormComponent } from '../theme/shared/components/ui-modal-form/ui-modal-form.component';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IContextService } from '../context/context.service';
import { SandboxAPIService } from '../services/sandbox.service';
import { validateAllFormFields } from '..';

@Directive()
export abstract class AdminCrudForm implements OnInit, AfterViewInit, OnDestroy {

  modalFormInstance: NgbModalRef;

  private _modalService: NgbModal;

  _sandboxService: SandboxAPIService;
  _contextService: IContextService;

  internalSubcription: Array<Subscription> = new Array<Subscription>();

  protected onValueChangesSubscription: Subscription;
  protected _onChangeSubscription: Subscription;
  protected _onResultSubcription: Subscription;

  protected onCreatedAndUpdatedSubscription: Subscription;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onResult: EventEmitter<CoreBaseModel> = new EventEmitter<CoreBaseModel>();

  _modelClass: typeof CoreBaseModel;

  private _controls: { [key: string]: any };

  get modelClass() {
    return this._modelClass;
  }

  set modelClass(model) {
    this._modelClass = model;
    this.modelIdPropertyName = model.getPropertyIdentityName;
  }

  @ViewChild(UIModalFormComponent, { static: true }) modal: UIModalFormComponent;

  @Input()
  readonly = false;

  model: CoreBaseModel;
  modelIdPropertyName: string;
  formGroup: FormGroup;

  autoPopulate = true;

  private _formBuilder: FormBuilder;

  _toastr: ToastrService;

  protected destroyed$ = new Subject<void>();

  constructor(formBuilder: FormBuilder, toastr: ToastrService, sandboxService: SandboxAPIService, modalService?: NgbModal) {
    this._formBuilder = formBuilder;
    this._toastr = toastr;
    this._modalService = modalService;
    this._sandboxService = sandboxService;
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngAfterViewInit(): void {

    this.onAfterViewInit();
  }

  ngOnDestroy(): void {

    this.onDestroy();

    if (this.internalSubcription.length > 0) {
      this.internalSubcription.map(r => r.unsubscribe());
    }

    if (this.onCreatedAndUpdatedSubscription) {
      this.onCreatedAndUpdatedSubscription.unsubscribe();
    }

    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected onClosingModal(data): void { }

  protected onInit(): void { }
  protected onAfterViewInit(): void { }
  protected onDestroy(): void { }
  protected onPopulated(model: CoreBaseModel): void { }

  protected onValueChanges(model: CoreBaseModel): Subscription {
    return null;
  }
  protected setMandatoryFields(model: CoreBaseModel): CoreBaseModel {
    return model;
  }
  protected parseModel(model: CoreBaseModel): CoreBaseModel {
    return model;
  }

  get controls() {
    return this._controls;
  }

  set controls(controls: { [key: string]: any }) {
    this._controls = controls;
    this.formGroup = this._formBuilder.group(this._controls);
  }

  populate(model: CoreBaseModel) {
    setTimeout(() => {
      this.model = Object.assign(new this.modelClass(), model);
      this.onValueChangesSubscription = this.onValueChanges(this.model);

      if (this.autoPopulate) {
        this.formGroup.patchValue(this.model);
      }

      this.onPopulated(this.model);
    }, 0);
  }

  protected registerUnSubcription(subscription: Subscription): void {

    this.internalSubcription.push(subscription);
  }

  protected validation(): boolean {

    const isInvalid = this.formGroup.invalid

    return isInvalid
  }

  public submit(event) {

    const model = Object.assign(new this.modelClass(), this.parseModel(this.formGroup.getRawValue() as CoreBaseModel));
    const modelCasted = this.setMandatoryFields(model);
    const id = modelCasted.getIdentity();

    if (id && id != '') { // Update
      this.update(modelCasted);
    } else { // Create

      this.create(modelCasted);
    }
  }

  protected create(model: CoreBaseModel): Promise<CoreBaseModel> {

    delete model._id;

    return new Promise((resolve, reject) => {

      this.onCreatedAndUpdatedSubscription = this._sandboxService.create(this._modelClass, model)
        .subscribe((results: CoreBaseModel) => {
          this._toastr.success('Operación realizada exitosamente', 'Registro exitoso', {
            timeOut: 3000
          });

          if (this.modal != null) {
            this.modal.close();
          }

          this.onResult.emit(results);

          resolve(results);
        }, (err) => {
          this._toastr.error(err.error.error, 'Ops!', {
            timeOut: 3000
          });

          reject(err);
        });
    });
  }

  protected update(model: CoreBaseModel): Promise<CoreBaseModel> {

    return new Promise((resolve, reject) => {

      const id = model.getIdentity();

      delete model._id;

      this.onCreatedAndUpdatedSubscription = this._sandboxService.update(this._modelClass,id, model)
        .subscribe((results: CoreBaseModel) => {
          this._toastr.success('Operación realizada exitosamente', 'Registro Actualizado', {
            timeOut: 3000
          });

          if (this.modal != null) {
            this.modal.close();
          }

          this.onResult.emit(results);

          resolve(results);
        }, (err) => {
          this._toastr.error(err.error.error, 'Ops!', {
            timeOut: 3000
          });

          reject(err);
        });
    });
  }

  protected setupModal(crudFormClass: any, options?: NgbModalOptions, readonly: boolean = false): AdminCrudForm {
    const optionsFull = Object.assign({} as NgbModalOptions, options);
    optionsFull.backdrop = 'static';
    optionsFull.size = options && options.size ? options.size : crudFormClass.modalSize ? crudFormClass.modalSize : 'default';

    const modalOpen = this._modalService.open(crudFormClass, optionsFull);
    this.modalFormInstance = modalOpen;

    const crudForm = modalOpen.componentInstance;
    crudForm.readonly = readonly;

    this._onChangeSubscription = crudForm.onChange.subscribe(() => {
      console.log('onChanged');
    });

    this._onResultSubcription = crudForm.onResult.subscribe((result) => {
      this.onClosingModal(result);
    });

    return crudForm;
  }

  protected updateFormValueAndValidityRecursively(control: AbstractControl) {
    if ((control as FormGroup).controls) {
      Object.keys((control as FormGroup).controls).map(key => {
        this.updateFormValueAndValidityRecursively((control as FormGroup).get(key));
      });
    } else {
      (control as FormControl).markAsDirty();
      (control as FormControl).updateValueAndValidity();
    }
  }
}
