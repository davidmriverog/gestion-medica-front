import { OnInit, AfterViewInit, Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { validateAllFormFields } from '../utils/validator.utils';

@Injectable({
  providedIn: 'root'
})
export abstract class LoginFormCore implements OnInit, OnDestroy, AfterViewInit {

  formGroup: FormGroup;

  _formBuilder: FormBuilder;

  _router: Router;

  _location: Location;

  submitted = false;

  private _controls: { [key: string]: any };

  private subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    location: Location
  ) {
    this._router = router;
    this._location = location;
    this._formBuilder = formBuilder;
  }

  async ngOnInit() {
    await this.onInit();
    this.onFecthsData();
  }

  async ngOnDestroy() {
    await this.onDestroy();

    if (this.subscriptions.length > 0) {
      this.subscriptions.map(r => r.unsubscribe());
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  get controls() {
    return this._controls;
  }

  set controls(controls: { [key: string]: any }) {
    this._controls = controls;
    this.formGroup = this._formBuilder.group(this._controls);
  }

  ngAfterViewInit(): void {
    this.onAfterInit();
  }

  protected onInit(): void { }

  protected onDestroy(): void { }

  protected onAfterInit(): void { }

  protected onFecthsData(): void { }

  protected onValidate(): boolean {
    return false;
  }

  protected onSubmit(): void { }

  protected registerOnSubscribe(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  protected inValidate(): boolean {

    if (this.formGroup.invalid) {
      validateAllFormFields(this.formGroup);
      return true;
    }

    if (this.onValidate()) {
      return true;
    }
  }

  previous(): void {
    this._location.back();
  }

  next(route?: string): void {
    this._router.navigate([route]);
  }

  submit(event: any): void {

    try {
      this.submitted = true;

      if (!this.inValidate()) {

        this.onSubmit();
      }
    } catch (error) {
      console.log('error.catch', error);
    }
  }
}
