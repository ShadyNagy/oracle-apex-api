import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticateService: AuthenticateService) { }

    intercept(request: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
        const token = this.authenticateService?.currentUserValue?.token;
        console.log(this.authenticateService?.currentUserValue);
        if (token) {
            request = request.clone({
                setHeaders: {                    
                    Authorization: `${token}`,
                    'X-Timezone-Offset': this.getTimezoneOffset(),
                    'Content-Type': 'application/json-patch+json',
                    'Accept': 'text/plain'
                }
            });
        }
        
        return next.handle(request).pipe(
            
            catchError(
              err =>
                new Observable<HttpEvent<any>>(observer => {
                  if (err instanceof HttpErrorResponse) {
                    const errResp = <HttpErrorResponse>err;
                    if (errResp.status === 401 || err.status === 403) {
                        this.authenticateService.logout();
                    }
                  }
                  observer.error(err);
                  observer.complete();
                })
            )

            
          );
    }

    private getTimezoneOffset(): string {
        return String( new Date().getTimezoneOffset() );
    }
}
