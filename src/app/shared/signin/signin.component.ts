import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { first, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  public form = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isloggedIn();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  onSubmit() {
    this.authService
      .login(this.form)
      .pipe(first())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          // this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log(error);
          // this.messageService.add({severity: 'error', summary: 'Service Message', detail: 'Via MessageService'});
        }
      );
  }
}
