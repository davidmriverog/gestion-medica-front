import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthInterface } from '../interfaces/auth.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) {

  }

  public login(user: AuthInterface): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/auth/login`, user);
  }

  public meUser(): Observable<any> {
    return this._http.get<any>(`${environment.apiUrl}/auth/me`);
  }

  public requestCodeForgotPassword(email: string): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/auth/sendCode`, {
      email: email
    });
  }

  public newPassword(body: { code: string, newPassword: string }): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/auth/newPassword`, body);
  }

  public newUserRegister(attrs: any): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/auth/newPatientUser`, attrs);
  }
}