import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

import { appConfig } from '../../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class IContextService {

  currentYear: number = Number(moment().format('YYYY'));

  constructor(
    private spinner: NgxSpinnerService
  ) {
    //
  }

  getYear(): number {
    return this.currentYear;
  }

  getTitle(): string {
    return appConfig.appName;
  }

  getDescription(): string {
    return appConfig.description;
  }

  getFooterTile(): string {
    return appConfig.footerTitle;
  }

  startLoading(message?: string): void {
    this.spinner.show();
  }

  stopLoading(): void {
    this.spinner.hide();
  }
}