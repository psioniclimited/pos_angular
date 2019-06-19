import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../../shared/service/loader.service';
import { ReportService } from '../../shared/service/report.service';
import { Router } from '@angular/router';
import { OrderService } from '../service/order.service';
import { ReportTypes } from '../../_model/report-types';
import { Subject } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { Loader } from '../../_model/loader';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { Calendar, DataTable } from 'primeng/primeng';
import { TotalSalesService } from '../service/total-sales.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})
export class OrderTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  totalPaid: any;
  totalDiscount: any;
  totalNoDiscount: any;
  cols: any[];
  loading = true;
  orders: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  items: MenuItem[];
  orderLazyEvent: LazyLoadEvent;
  orderID: any;

  deleteDisplay = false;

  reportTypes: ReportTypes;

  @ViewChild('dt')
  tableData: DataTable;

  // filters
  rangeDates: Date[];
  dateFilters: MenuItem[];

  @ViewChild('dateFilter')
  calendar: Calendar;

  globalFilter: string;

  // globalFiltersArray: any = [
  //   { name: 'All', value: 'global' },
  //   { name: 'Code', value: 'code' },
  //   { name: 'Name', value: 'name' },
  //   { name: 'Phone', value: 'phone' },
  //   { name: 'Address', value: 'address' },
  //   { name: 'Card', value: 'card_number' },
  // ];
  //
  // selectGlobalFilter = { name: 'All', value: 'global' };

  constructor(
    private orderService: OrderService,
    private totalService: TotalSalesService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private router: Router
  ) {
    this.reportTypes = new ReportTypes();
  }

  ngOnInit() {
    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'name', header: 'Customer' },
      { field: 'total', header: 'Total' },
      { field: 'discount', header: 'Discount' },
      { field: 'grand_total', header: 'Paid' }
    ];

    this.dateFilters = [
      {
        label: 'Today',
        icon: 'pi pi-calendar',
        command: () => {
          this.todayFilter();
        }
      },
      {
        label: 'Yesterday',
        icon: 'pi pi-calendar',
        command: () => {
          this.yesterdayFilter();
        }
      },
      {
        label: 'Last 7 days',
        icon: 'pi pi-calendar',
        command: () => {
          this.last7DaysFilter();
        }
      },
      {
        label: 'Last 30 days',
        icon: 'pi pi-calendar',
        command: () => {
          this.last30DaysFilter();
        }
      },
      {
        label: 'This Month',
        icon: 'pi pi-calendar',
        command: () => {
          this.thisMonthFilter();
        }
      },
      {
        label: 'Last Month',
        icon: 'pi pi-calendar',
        command: () => {
          this.lastMonthFilter();
        }
      }
    ];
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadOrdersLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.orderLazyEvent = event;
    this.orderService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.orders = data.data;
      });

    this.totalService
      .total_paid(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalPaid = data[0].total;
      });

    this.totalService
      .total_discount(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalDiscount = data[0].total;
      });
    this.totalService
      .grand_total(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalNoDiscount = data[0].total;
      });
  }

  todayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.orderLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates[0], 'orders.date', 'equals');
  }

  yesterdayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(
      moment()
        .subtract(1, 'days')
        .toDate()
    );
    // @ts-ignore
    this.orderLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates[0], 'orders.date', 'equals');
  }

  last7DaysFilter() {
    this.rangeDates = [];
    this.rangeDates.push(
      moment()
        .subtract(7, 'days')
        .toDate()
    );
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.orderLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'orders.date', 'equals');
  }

  last30DaysFilter() {
    this.rangeDates = [];
    this.rangeDates.push(
      moment()
        .subtract(30, 'days')
        .toDate()
    );
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.orderLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'orders.date', 'equals');
  }

  thisMonthFilter() {
    this.rangeDates = [];
    this.rangeDates.push(
      moment()
        .date(1)
        .toDate()
    );
    this.rangeDates.push(
      moment()
        .date(1)
        .endOf('month')
        .toDate()
    );
    // @ts-ignore
    this.orderLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'orders.date', 'equals');
  }

  lastMonthFilter() {
    this.rangeDates = [];
    this.rangeDates.push(
      moment()
        .subtract(1, 'month')
        .date(1)
        .toDate()
    );
    this.rangeDates.push(
      moment()
        .subtract(1, 'month')
        .date(1)
        .endOf('month')
        .toDate()
    );
    // @ts-ignore
    this.orderLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'orders.date', 'equals');
  }

  filterDateRange(event) {
    // @ts-ignore
    this.orderLazyEvent.filters.date = this.rangeDates;
  }

  clearFilters() {
    // date filter reset
    this.rangeDates = null;
    this.calendar.value = null;
    this.calendar.inputFieldValue = null;

    this.globalFilter = '';
  }

  viewOrder(id) {
    this.router.navigate(['/order/', id], {});
  }

  showDeleteDialog(orderID) {
    this.orderID = orderID;
    this.deleteDisplay = true;
  }

  // onDeleteSubmit() {
  //   this.orderService
  //     .delete(this.orderID)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe(response => {
  //       this.loadOrdersLazy(this.orderLazyEvent);
  //     });
  //   this.deleteDisplay = false;
  // }

  closeDeleteDialog() {
    this.deleteDisplay = false;
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'orders', this.orderLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'orders_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          filename =
            'orders_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'orders_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
