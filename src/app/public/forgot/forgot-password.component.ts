import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { appConfig } from '../../config/app.config';

import { IAppState, IContextService, LoginFormCore, requestForgotPassword } from '../../exports/lib';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends LoginFormCore {

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
    private location: Location,
    private renderer: Renderer2,
    private contextService: IContextService,
    private store: Store<IAppState>
  ) {
    super(router, formBuilder, location);

    this.controls = {
      email: ['', Validators.compose([Validators.required, Validators.email])],
    };

    this.renderer.addClass(document.body, 'bg-white');
  }

  onInit(): void {
    this.titleApp = this.contextService.getTitle();
    this.descriptionApp = this.contextService.getDescription();
    this.year = this.contextService.getYear();
    this.footerTitle = this.contextService.getFooterTile();
  }

  onDestroy(): void {
    //this.renderer.removeClass(document.body, 'bg-white');
  }

  onSubmit(): void {

    this.store.dispatch(requestForgotPassword({
      email: this.formGroup.get('email').value
    }));
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

}
