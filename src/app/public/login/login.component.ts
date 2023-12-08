import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { appConfig } from '../../config/app.config';
import { UIAppStateEnum } from '../../core/enums/app/app.enum';

import { errorMessage, getLoading, getMode, IAppState, IContextService, isFailedLogin, login, LoginFormCore } from '../../exports/lib';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends LoginFormCore {

  uiAppEnum = UIAppStateEnum;

  formGroup: FormGroup;

  sanitizedBackgroundUrl: string = 'url(assets/images/login-bg-12.jpg)';

  appConfig = appConfig;

  authenticating: boolean = false;

  year: number;

  titleApp: string;
  descriptionApp: string;
  footerTitle: string;

  isLoading$: Observable<boolean>;

  isFailed$: Observable<boolean> = this.store.pipe(
    select(isFailedLogin)
  );

  errorMessage$: Observable<string> = this.store.pipe(
    select(errorMessage)
  );

  mode$: Observable<string> = this.store.pipe(
    select(getMode)
  );

  disabledButtom: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    private renderer: Renderer2,
    private contextService: IContextService,
    private store: Store<IAppState>
  ) {
    super(router, formBuilder, location);

    this.controls = {
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    };

    this.renderer.addClass(document.body, 'bg-white');
  }

  onInit(): void {
    this.titleApp = this.contextService.getTitle();
    this.descriptionApp = this.contextService.getDescription();
    this.year = this.contextService.getYear();
    this.footerTitle = this.contextService.getFooterTile();

    this.isLoading$ = this.store.pipe(
      select(getLoading)
    );
  }

  onDestroy(): void {
    this.renderer.removeClass(document.body, 'bg-white');
  }

  onSubmit(): void {

    this.store.dispatch(login({
      username: this.formGroup.get('username').value,
      password: this.formGroup.get('password').value
    }));
  }

  goForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  goNewRegister(): void {
    this.router.navigate(['/register']);
  }

  redirectHome(): void {
    this.router.navigate(['/']);
  }

  resolved(captchaResponse: string) {
    this.disabledButtom = false;
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  onError(event: any) {
    this.disabledButtom = true;
  }



  errored() {
    this.disabledButtom = true;
    console.warn(`reCAPTCHA error encountered`);
  }

}
