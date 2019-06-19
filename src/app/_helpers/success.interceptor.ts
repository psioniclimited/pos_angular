import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        // @ts-ignore
        if (event.body) {
          // @ts-ignore
          if (event.body.create) {
            // @ts-ignore
            const details = event.body.create.message;
            this.messageService.add({
              severity: 'success',
              summary: 'Creation successful',
              detail: details
            });
          }

          // @ts-ignore
          if (event.body.update) {
            // @ts-ignore
            const details = event.body.update.message;
            this.messageService.add({
              severity: 'success',
              summary: 'Update successful',
              detail: details
            });
          }

          // @ts-ignore
          if (event.body.delete) {
            // @ts-ignore
            const details = event.body.delete.message;
            this.messageService.add({
              severity: 'success',
              summary: 'Delete successful',
              detail: details
            });
          }
        }
      })
    );
  }
}
