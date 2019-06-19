import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../../auth/service/profile.service';
import * as moment from 'moment';
import { ChartOfAccountService } from '../../accounting/service/chart-of-account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  isLoggedIn$: Observable<boolean>;
  navbarOpen = false;

  user: any;

  validity: any;

  chartOfAccountRoute: any;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private chartOfAccountService: ChartOfAccountService
  ) {}

  ngOnInit() {
    // this.loadProfileData();
    // this.loadChartOfAccountRoutes();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadProfileData() {
    // this.user = this.profileService.index();
    // this.validity = this.user;
    // console.log(this.validity);
    this.profileService
      .index()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.user = data;
        this.validity = -moment().diff(this.user.company.valid_to, 'days');
      });
  }

  loadChartOfAccountRoutes() {
    const filters = { parent_accounts: '1' };
    this.chartOfAccountService
      .index(filters)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(accounts => {
        this.chartOfAccountRoute = accounts[0].id;
      });
  }

  onLogout() {
    this.authService
      .logout()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
      });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
