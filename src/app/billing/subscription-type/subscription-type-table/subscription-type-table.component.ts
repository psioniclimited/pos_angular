import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Paginate } from '../../../_model/paginate';
import { LazyLoadEvent } from 'primeng/api';
import { SubscriptionTypeService } from '../../service/subscription-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-subscription-type-table',
  templateUrl: './subscription-type-table.component.html',
  styleUrls: ['./subscription-type-table.component.scss']
})
export class SubscriptionTypeTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @ViewChildren('dt')
  table;
  subscription_types: Paginate[];
  totalRecords: number;
  cols: any[];
  loading: boolean;

  constructor(
    private subscriptionTypeService: SubscriptionTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [{ field: 'name', header: 'Name' }];
    this.loading = true;
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadSubscriptionTypesLazy(event: LazyLoadEvent) {
    this.subscriptionTypeService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(subscription_types => {
        this.totalRecords = subscription_types.total;
        this.subscription_types = subscription_types.data;
        this.loading = false;
      });
  }

  editSubscriptionType(id: number) {
    this.router.navigate(['/subscription-type/', id, 'edit'], {
      relativeTo: this.route
    });
  }
}
