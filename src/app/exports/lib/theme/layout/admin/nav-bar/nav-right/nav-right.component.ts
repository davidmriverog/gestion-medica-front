import { Component, DoCheck, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { GradientConfig } from '../../../../../../../config/gradient-app.config';

import { RoleEnum } from '../../../../../../../core/enums/sys/rol-values.enum';
import { GenderEnum } from '../../../../../../../core/enums/mat/gender.enum';
import { getUserMedic, getUserPatient, getUserStaff, logoutUser } from '../../../../../../../exports/lib/store/modules/auth';
import { IAppState } from '../../../../../../../exports/lib/store/core/states/core.state';

@Component({
    selector: 'app-nav-right',
    templateUrl: './nav-right.component.html',
    styleUrls: ['./nav-right.component.scss'],
    providers: [NgbDropdownConfig],
    animations: [
        trigger('slideInOutLeft', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
            ])
        ]),
        trigger('slideInOutRight', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
            ])
        ])
    ]
})
export class NavRightComponent implements OnInit, DoCheck {
    public visibleUserList: boolean;
    public chatMessage: boolean;
    public friendId: boolean;
    public gradientConfig: any;

    staffUser$: Observable<any> = this.store.pipe(
        select(getUserStaff)
    );

    medicalUser$: Observable<any> = this.store.pipe(
        select(getUserMedic)
    );

    patientUser$: Observable<any> = this.store.pipe(
        select(getUserPatient)
    );

    roleEnum = RoleEnum;

    genderEnum = GenderEnum;

    constructor(
        private store: Store<IAppState>
    ) {
        this.visibleUserList = false;
        this.chatMessage = false;
        this.gradientConfig = GradientConfig.config;
    }

    ngOnInit() { }

    onChatToggle(friendID) {
        this.friendId = friendID;
        this.chatMessage = !this.chatMessage;
    }

    ngDoCheck() {
        if (document.querySelector('body').classList.contains('elite-rtl')) {
            this.gradientConfig['rtl-layout'] = true;
        } else {
            this.gradientConfig['rtl-layout'] = false;
        }
    }

    logout(): void {
        this.store.dispatch(logoutUser());
    }
}
