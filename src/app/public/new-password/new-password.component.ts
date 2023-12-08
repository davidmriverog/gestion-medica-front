import { Component, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { appConfig } from '../../config/app.config';

import { IAppState, IContextService, LoginFormCore, sendNewPassword, addCustomError } from '../../exports/lib';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html'
})
export class NewPasswordComponent extends LoginFormCore {

  formGroup: FormGroup;

  sanitizedBackgroundUrl: string = 'url(assets/images/login-bg-12.jpg)';

  appConfig = appConfig;

  authenticating: boolean = false;

  year: number;

  titleApp: string;
  descriptionApp: string;
  footerTitle: string;

  isLoading$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private renderer: Renderer2,
    private contextService: IContextService,
    private store: Store<IAppState>
  ) {
    super(router, formBuilder, location);

    this.controls = {
      code: [''],
      newPassword: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required, this.checkConfirmedPassword.bind(this)])],
    };

    this.renderer.addClass(document.body, 'bg-white');
  }

  onInit(): void {
    this.titleApp = this.contextService.getTitle();
    this.descriptionApp = this.contextService.getDescription();
    this.year = this.contextService.getYear();
    this.footerTitle = this.contextService.getFooterTile();

    this.registerOnSubscribe(this.route.queryParams.pipe(
      filter((params) => !!params['code']),
      map((params) => params['code'])
    ).subscribe((code) => {

      if (code) {
        this.formGroup.get('code').setValue(code);
      }
    }));
  }

  onDestroy(): void {
    //this.renderer.removeClass(document.body, 'bg-white');
  }

  onSubmit(): void {

    this.store.dispatch(sendNewPassword({
      code: this.formGroup.get('code').value,
      newPassword: this.formGroup.get('newPassword').value
    }));
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

  private checkConfirmedPassword(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.value) {
      return null;
    }

    if (this.formGroup.get('newPassword').value !== this.formGroup.get('confirmPassword').value) {
      return addCustomError('confirmPassword', 'Ambas contraseña deben coincidir.', control);
    }

    return null;
  }

}
