import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../shared/service/auth.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private messageService: MessageService,
    private authenticationService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        console.log(err);
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Service Message',
            detail: err.error.error
          });
          // console.log('in error');
          // auto logout if 401 response returned from api
          this.authenticationService.logout().subscribe();
          // location.reload(true);
        }

        if (err.status === 403) {
          const details = err.error.message;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: details
          });
        }

        if (err.status === 422) {
          let details = '';
          const errors = err.error;
          for (const er in errors['errors']) {
            if (er) {
              console.log(errors['errors'][er]);
              details += errors['errors'][er][0] + ' ';
            }
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Validation Errors',
            detail: details
          });
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
