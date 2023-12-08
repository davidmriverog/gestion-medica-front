import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { appConfig } from '../../config/app.config';

import { getLoading, IAppState, IContextService, isFailedLogin, login, LoginFormCore, setModeUI } from '../../exports/lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends LoginFormCore {

  formGroup: FormGroup;

  sanitizedBackgroundUrl: string = 'url(assets/images/login-bg-12.jpg)';

  appConfig = appConfig;

  authenticating: boolean = false;

  year: number;

  titleApp: string;
  descriptionApp: string;
  footerTitle: string;

  clientTypes: Array<{ name: string, mode: string, route: string, imageUrl }> = [
    {
      name: 'Administrativo',
      route: 'login',
      mode: 'ADMIN',
      imageUrl: '/assets/images/admin.png'
    },
    {
      name: 'Médico',
      route: 'login',
      mode: 'MEDICAL',
      imageUrl: '/assets/images/medico.png'
    },
    {
      name: 'Pacientes',
      route: 'login',
      mode: 'PATIENT',
      imageUrl: '/assets/images/paciente.png'
    }
  ];


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
    this.renderer.removeClass(document.body, 'bg-white');
  }

  onSubmit(): void {


  }

  goLogin(mode: string): void {
    this.store.dispatch(setModeUI({
      mode: mode
    }))

    this.router.navigate(['/login']);
  }
}
