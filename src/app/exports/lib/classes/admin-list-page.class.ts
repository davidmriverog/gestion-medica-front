import { AfterViewInit, Directive, Injectable, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { IContextService } from '../context/context.service';

import Swal from 'sweetalert2';

import { CoreBaseModel } from './core-base-model.class';

import { SandboxAPIService } from '../services/sandbox.service';

@Injectable()
export class AdminListPage implements OnInit, OnDestroy, AfterViewInit {

  crudFormClass: any;
  _modelClass: typeof CoreBaseModel;

  get modelClass() {
    return this._modelClass;
  }

  set modelClass(model) {
    this._modelClass = model;
  }

  modalFormInstance: NgbModalRef;

  private _modalService: NgbModal;

  _contextService: IContextService;

  private _onChangeSubscription: Subscription;
  private _onResultSubcription: Subscription;
  private _onDeletetSubcription: Subscription;
  private _sandboxService: SandboxAPIService;

  protected destroyed$ = new Subject<void>();

  constructor(
    modalService: NgbModal,
    contextService: IContextService,
    sandboxService: SandboxAPIService
  ) {

    this._modalService = modalService;
    this._contextService = contextService;
    this._sandboxService = sandboxService;
  }

  protected onInit(): void { }
  protected onResultEventForm(): void { }
  protected onAfterViewInit(): void { }
  protected onRealTimeUpdate(): void { }

  async ngOnInit() {
    await this.onInit();
  }

  async ngAfterViewInit() {
    await this.onAfterViewInit();
  }

  ngOnDestroy(): void {

    if (this._onChangeSubscription) {
      this._onChangeSubscription.unsubscribe();
    }

    if (this._onResultSubcription) {
      this._onResultSubcription.unsubscribe();
    }

    if (this.modalFormInstance) {
      this.modalFormInstance.close();
    }

    if (this._onDeletetSubcription) {
      this._onDeletetSubcription.unsubscribe();
    }

    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected setupModal(crudFormClass: any, options?: NgbModalOptions, readonly: boolean = false) {
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

    this._onResultSubcription = crudForm.onResult.subscribe(() => {

      this.onRealTimeUpdate();
    });

    return crudForm;
  }

  createModal(initialModel?: CoreBaseModel, options?: NgbModalOptions, crudFormClass?: any, modelClass?: typeof CoreBaseModel, readonly: boolean = false) {
    const crudForm = this.setupModal(crudFormClass ? crudFormClass : this.crudFormClass, options, readonly);

    if (initialModel) {
      crudForm.populate(initialModel);
    }
  }

  editModal(initialModel?: CoreBaseModel, options?: NgbModalOptions, crudFormClass?: any, modelClass?: typeof CoreBaseModel, readonly: boolean = false) {
    const crudForm = this.setupModal(crudFormClass ? crudFormClass : this.crudFormClass, options, readonly);

    if (initialModel) {
      crudForm.populate(initialModel);
    }
  }

  delete(id: string): void {

    Swal.fire({
      title: `Eliminar`,
      text: `¿Esta seguro de realizar esta operación?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No!',
      reverseButtons: true,
      backdrop: true
    }).then((result) => {
      if (result.value) {

        this._contextService.startLoading();

        this._onDeletetSubcription = this._sandboxService.delete(this.modelClass, id)
          .subscribe((results) => {

            Swal.fire(
              'Proceso exitoso',
              'Se ha removido exitosamente el registro',
              'success'
            );

            this.onRealTimeUpdate();

            this._contextService.stopLoading();

          });

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

        Swal.fire(
          'Operación cancelada',
          'has cancelado la operación',
          'error'
        );
      }
    });

  }

}