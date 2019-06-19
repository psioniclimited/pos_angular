import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ChartOfAccountService } from '../service/chart-of-account.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.scss']
})
export class ChartOfAccountComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  items: MenuItem[];
  constructor(private chartOfAccountService: ChartOfAccountService) {}

  ngOnInit() {
    const filters = { parent_accounts: '1' };
    this.chartOfAccountService
      .index(filters)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(accounts => {
        this.items = [
          {
            label: 'Assets',
            icon: 'fa fa-fw fa-bar-chart',
            routerLink: '/chart-of-account/' + accounts[0].id
          },
          {
            label: 'Liabilities',
            icon: 'fa fa-fw fa-calendar',
            routerLink: '/chart-of-account/' + accounts[1].id
          },
          {
            label: 'Income',
            icon: 'fa fa-fw fa-book',
            routerLink: '/chart-of-account/' + accounts[2].id
          },
          {
            label: 'Expense',
            icon: 'fa fa-fw fa-support',
            routerLink: '/chart-of-account/' + accounts[3].id
          },
          {
            label: 'Equity',
            icon: 'fa fa-fw fa-twitter',
            routerLink: '/chart-of-account/' + accounts[4].id
          }
        ];
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
