import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getPeriod } from '../../../../../store/modules/auth';

import { IAppState } from '../../../../../store/core/states/core.state';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit {

  period$: Observable<any> = this.store.pipe(
    select(getPeriod)
  );

  constructor(
    private store: Store<IAppState>
  ) { }

  ngOnInit() {
  }

}
