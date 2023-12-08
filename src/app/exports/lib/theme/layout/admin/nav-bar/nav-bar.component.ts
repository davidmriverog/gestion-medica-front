import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { select, Store } from '@ngrx/store';

import { GradientConfig } from '../../../../../../config/gradient-app.config';
import { getClientInfo } from '../../../../store/modules/auth';

import { IAppState } from '../../../../store/core/states/core.state';
import { ClientInfoModel } from 'src/app/project/models/config/client-info.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {
  public gradientConfig: any;
  public menuClass: boolean;
  public collapseStyle: string;
  public windowWidth: number;

  @Output() onNavCollapse = new EventEmitter();
  @Output() onNavHeaderMobCollapse = new EventEmitter();

  clientInfo$: Observable<ClientInfoModel>;

  constructor(
    private store: Store<IAppState>
  ) {
    this.gradientConfig = GradientConfig.config;
    this.menuClass = false;
    this.collapseStyle = 'none';
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
    this.clientInfo$ = this.store.pipe(
        select(getClientInfo)
    );
  }

  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.collapseStyle = (this.menuClass) ? 'block' : 'none';
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.onNavCollapse.emit();
    } else {
      this.onNavHeaderMobCollapse.emit();
    }
  }

}
