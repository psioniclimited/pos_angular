import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../../shared/service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { OrderService } from '../service/order.service';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Calendar, DataTable } from 'primeng/primeng';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { ReportTypes } from '../../_model/report-types';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../shared/service/report.service';
import { Loader } from '../../_model/loader';
import { TotalSalesService } from '../service/total-sales.service';
import { ProductSalesReportService } from '../service/product-sales-report.service';

@Component({
  selector: 'app-product-sales-report',
  templateUrl: './product-sales-report.component.html',
  styleUrls: ['./product-sales-report.component.scss']
})
export class ProductSalesReportComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  totalPaid: any;
  totalDiscount: any;
  total: any;

  cols: any[];
  loading = true;
  sales: any[];
  totalRecords: number;
  from: number;
  to: number;
  items: MenuItem[];
  salesLazyEvent: LazyLoadEvent;

  reportTypes: ReportTypes;

  @ViewChild('dt')
  tableData: DataTable;

  // filters
  rangeDates: Date[];
  dateFilters: MenuItem[];

  @ViewChild('dateFilter')
  calendar: Calendar;

  globalFilter: string;

  constructor(
    private salesReportService: ProductSalesReportService,
    private totalService: TotalSalesService,
    private reportService: ReportService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reportTypes = new ReportTypes();
  }

  ngOnInit() {
    this.cols = [
      // { field: 'paid_with', subfield: 'name', header: 'Paid With' },
      { field: 'name', header: 'Product Name' },
      { field: 'type', header: 'Option Type' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'sale_price', header: 'Unit Price' },
      { field: 'total', header: 'Total' }
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

  loadSalesLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.salesLazyEvent = event;
    this.salesReportService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        // @ts-ignore
        this.sales = data;
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
        this.total = data[0].total;
      });
  }


  todayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.salesLazyEvent.filters.date = this.rangeDates;
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
    this.salesLazyEvent.filters.date = this.rangeDates;
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
    this.salesLazyEvent.filters.date = this.rangeDates;
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
    this.salesLazyEvent.filters.date = this.rangeDates;
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
    this.salesLazyEvent.filters.date = this.rangeDates;
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
    this.salesLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'orders.date', 'equals');
  }

  filterDateRange(event) {
    // @ts-ignore
    this.salesLazyEvent.filters.date = this.rangeDates;
  }

  clearFilters() {
    // date filter reset
    this.rangeDates = null;
    this.calendar.value = null;
    this.calendar.inputFieldValue = null;

    this.globalFilter = '';
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'product_sales', this.salesLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'product_sales_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          filename =
            'product_sales_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'product_sales_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }

}
