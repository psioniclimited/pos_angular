import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from '../service/customer.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Customer } from '../../_model/customer';
import { Subject } from 'rxjs';
import { LoaderService } from '../../shared/service/loader.service';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent } from 'primeng/api';
import { Loader } from '../../_model/loader';
import { BillCollectionService } from '../service/bill-collection.service';

@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrls: ['./show-customer.component.scss']
})
export class ShowCustomerComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  showCustomer: Customer;
  id: number;

  billCollections: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;

  constructor(
    private customerService: CustomerService,
    private billCollectionService: BillCollectionService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'phone', header: 'Phone' },
      { field: 'area', header: 'Area' },
      { field: 'no_of_months', header: 'Bill Months' },
      { field: 'created_at', header: 'Timestamp' },
      { field: 'collector', header: 'Collected By' },
      { field: 'total', header: 'Total Bill' },
      { field: 'discount', header: 'Discount' },
      { field: 'grand_total', header: 'Paid' }
    ];

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.id) {
        this.customerService
          .show(this.id)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.showCustomer = data;
              // this.editFormInit();
            },
            error => {
              console.log(error);
            }
          );
      }
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadBillCollectionsLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });

    event.filters.id = {
      matchMode: 'equals',
      value: this.id
    };

    this.billCollectionService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.billCollections = data.data;
      });
  }
}
