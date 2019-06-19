import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoaderService } from '../shared/service/loader.service';
import { Router } from '@angular/router';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private router: Router, private loaderService: LoaderService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // this.router.events.subscribe((val) => {
    this.showLoader();
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.onEnd();
          }
        },
        (err: any) => {
          this.onEnd();
        }
      ),
      finalize(() => {
        this.hideLoader();
      })
    );
    // });
    // return null;
  }
  private onEnd(): void {
    this.hideLoader();
  }
  private showLoader(): void {
    this.loaderService.show();
  }
  private hideLoader(): void {
    this.loaderService.hide();
  }
}
