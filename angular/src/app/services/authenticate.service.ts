import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelper } from '../core/helpers/jwt-helper';
import { ApiResult } from '../models/api-result';
import { AuthenticationInfo } from '../models/authentication-info';
import { LoginUser } from '../models/login-user';

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {
    private loginUrl = 'User/Login';
    private currentUserSubject: BehaviorSubject<AuthenticationInfo>;
    public currentUser: Observable<AuthenticationInfo>;
    public static isAuth = false;

    constructor(private http: HttpClient,
                private router: Router) {
        const data = localStorage.getItem('currentUser');
        if(data) {
            this.currentUserSubject = new BehaviorSubject<AuthenticationInfo>(JSON.parse(data));
            this.currentUser = this.currentUserSubject.asObservable();
        }  else {
            this.currentUserSubject = new BehaviorSubject<AuthenticationInfo>(new AuthenticationInfo(0, '', ''));
            this.currentUser = this.currentUserSubject.asObservable();
        }      
    }

    public get currentUserValue(): AuthenticationInfo {
        return this.currentUserSubject.value;
    }

    login(loginUser: LoginUser): Observable<ApiResult<string>>
    {
        return this.http.post<ApiResult<string>>(`${environment.BASE_URL}/${this.loginUrl}`, loginUser)
        .pipe(map((user) => {
            if ( user && user.data)
            {
                const jwtInfo = JwtHelper.getDecodedAccessToken(user.data);
                const authInfo = new AuthenticationInfo(jwtInfo.id, jwtInfo.job, user.data);

                localStorage.setItem('currentUser', JSON.stringify(authInfo));
                this.currentUserSubject.next(authInfo);
                AuthenticateService.isAuth = true;
            }else {
                AuthenticateService.isAuth = false;
            }
            return user;
        }));
    }

    logout(): void{
        localStorage.clear();
        this.currentUserSubject = new BehaviorSubject<AuthenticationInfo>(new AuthenticationInfo(0, '', ''));
        this.currentUser = this.currentUserSubject.asObservable();
        this.router.navigate(['login']);
    }
}
