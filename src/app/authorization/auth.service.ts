import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import {throwError, BehaviorSubject, Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import {AuthResponseData, ForgotPasswordData} from "./shared/interfaces";
import {User} from "./user.module";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private cookieService: CookieService // Inject the cookie service
  ) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCqX4WpAVmm9xPKahvcH2xCwl1Ur7kwyHA', {
      email: email, password: password, returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  userInfo(localId: string, firstName: string, lastName: string,email:string,country:string) {
    return this.http.put(`https://ng-complete-guide-d4312-default-rtdb.firebaseio.com/:${localId}.json`, {
      firstName: firstName,
      lastName: lastName,
      email:email,
      country:country,
    })
  }
  getUserInfo(localId: string): Observable<any> {
    const url = `https://ng-complete-guide-d4312-default-rtdb.firebaseio.com/:${localId}.json`; // Replace with your actual URL

    return this.http.get(url);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCqX4WpAVmm9xPKahvcH2xCwl1Ur7kwyHA', {
      email: email, password: password, returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  forgotPassword(requestType: string, email: string) {
    return this.http.post<ForgotPasswordData>('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCqX4WpAVmm9xPKahvcH2xCwl1Ur7kwyHA', {
      requestType: requestType, email: email
    }).pipe(catchError(this.handleError))
  }

  autoLogin() {
    const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(this.cookieService.get('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.cookieService.set('userData', JSON.stringify(user)); // Set the user data in the cookie
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
