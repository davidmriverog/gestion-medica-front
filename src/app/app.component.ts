import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NavigationEnd, Route, Router } from '@angular/router';

import { checkUser, IAppState, IContextService, initModeUI } from './exports/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  titleSubscription: Subscription;

  constructor(
    private titleService: Title,
    private contextService: IContextService,
    private store: Store<IAppState>,
    private router: Router
  ) {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.contextService.getTitle());

    this.store.dispatch(checkUser());
    this.store.dispatch(initModeUI());
  }
}
