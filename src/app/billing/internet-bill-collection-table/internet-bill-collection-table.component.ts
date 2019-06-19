import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ReportTypes } from '../../_model/report-types';
import { AutoComplete, Calendar, DataTable } from 'primeng/primeng';
import { Area } from '../../_model/area';
import { User } from '../../_model/user';
import { Table } from 'primeng/table';
import { TotalService } from '../service/total.service';
import { AreaService } from '../service/area.service';
import { UserService } from '../../auth/service/user.service';
import { LoaderService } from '../../shared/service/loader.service';
import { ReportService } from '../../shared/service/report.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Loader } from '../../_model/loader';
import { InternetBillCollectionService } from '../service/internet-bill-collection.service';

@Component({
  selector: 'app-internet-bill-collection-table',
  templateUrl: './internet-bill-collection-table.component.html',
  styleUrls: ['./internet-bill-collection-table.component.scss']
})
export class InternetBillCollectionTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  cols: any[];
  loading = true;
  billCollections: Paginate[]; // billCollections
  totalRecords: number;
  from: number;
  to: number;
  printing: MenuItem[];
  discountDisplay = false;
  discount = { discount: null };
  billCollectionId: number; // billCollectionId for refund and discount
  refundDisplay = false;
  total_bill: number;
  discounted_bill: number;
  billCollectionLazyEvent: LazyLoadEvent;
  totalBill = 0;
  scrollable = false;
  reportTypes: ReportTypes;

  @ViewChild('dt')
  tableData: DataTable;

  // filter section
  areas: Area[];
  rangeDates: Date[];
  dateFilters: MenuItem[];
  billCollectors: User[];

  globalFiltersArray: any = [
    { name: 'All', value: 'global' },
    { name: 'Code', value: 'code' },
    { name: 'Name', value: 'name' },
    { name: 'Phone', value: 'phone' }
  ];

  selectGlobalFilter = { name: 'All', value: 'global' };

  @ViewChild('areaDropdown')
  areaDropdown: AutoComplete;
  areaFilter: any;
  @ViewChild('dateFilter')
  calendar: Calendar;
  @ViewChild('collectorDropdown')
  collectorDropdown: AutoComplete;
  collectorFilter: any;
  globalFilter: string;
  previousGlobalFilter: any;

  @ViewChild('dt')
  dataTable: Table;

  constructor(
    private internetBillCollectionService: InternetBillCollectionService,
    private totalService: TotalService,
    private areaService: AreaService,
    private userService: UserService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.reportTypes = new ReportTypes();
    breakpointObserver
      .observe([Breakpoints.TabletPortrait])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
        if (result.matches) {
          this.scrollable = true;
        } else {
          this.scrollable = false;
        }
      });
  }

  ngOnInit() {
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'phone', header: 'Phone' },
      { field: 'area', header: 'Area' },
      { field: 'shared', header: 'Shared' },
      { field: 'ppoe', header: 'PPOE' },
      { field: 'bandwidth', header: 'Bandwidth' },
      { field: 'no_of_months', header: 'Bill Months' },
      { field: 'created_at', header: 'Timestamp' },
      { field: 'collector', header: 'Collected By' },
      { field: 'total', header: 'Total Bill' },
      { field: 'discount', header: 'Discount' },
      { field: 'grand_total', header: 'Paid' }
    ];

    this.printing = [
      {
        label: 'CSV',
        icon: 'pi pi-refresh',
        command: () => {
          this.generateReport(this.reportTypes.xlsx);
        }
      },
      {
        label: 'PDF',
        icon: 'pi pi-times',
        command: () => {
          this.generateReport(this.reportTypes.pdf);
        }
      },
      {
        label: 'CSV',
        icon: 'pi pi-times',
        command: () => {
          this.generateReport(this.reportTypes.csv);
        }
      }
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

  viewCustomer(id) {
    this.router.navigate(['/customer/', id], {});
  }

  loadBillCollectionLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });

    event.filters.internet = {
      matchMode: 'equals',
      value: true
    };

    this.billCollectionLazyEvent = event;
    this.internetBillCollectionService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.billCollections = data.data;
      });

    this.totalService
      .total_bill(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalBill = data[0].total;
      });
  }

  getAreas(event) {
    this.areaService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(areas => {
        this.areas = areas.data;
      });
  }

  getBillCollectors(event) {
    this.userService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(collectors => {
        this.billCollectors = collectors.data;
      });
  }

  todayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.billCollectionLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates[0], 'created_at', 'equals');
  }

  yesterdayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(
      moment()
        .subtract(1, 'days')
        .toDate()
    );
    // @ts-ignore
    this.billCollectionLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates[0], 'created_at', 'equals');
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
    this.billCollectionLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'created_at', 'equals');
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
    this.billCollectionLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'created_at', 'equals');
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
    this.billCollectionLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'created_at', 'equals');
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
    this.billCollectionLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'created_at', 'equals');
  }

  filterDateRange(event) {
    // @ts-ignore
    this.billCollectionLazyEvent.filters.date = this.rangeDates;
  }

  clearFilters() {
    this.areaFilter = null;
    // date filter reset
    this.rangeDates = null;
    this.calendar.value = null;
    this.calendar.inputFieldValue = null;

    this.collectorFilter = null;
    this.selectGlobalFilter = { name: 'All', value: 'global' };
    this.globalFilter = '';
  }

  clearGlobal() {
    this.globalFilter = '';
    this.dataTable.filter('', this.previousGlobalFilter, 'contains');
  }

  search(event) {
    this.previousGlobalFilter = this.selectGlobalFilter.value;
    this.dataTable.filter(
      event.target.value,
      this.selectGlobalFilter.value,
      'contains'
    );
  }

  showDiscountDialog(billCollectionId, total_bill, discount) {
    this.billCollectionId = billCollectionId;
    this.discounted_bill = total_bill - discount;
    this.total_bill = Number(total_bill);
    this.discount.discount = discount;
    this.discountDisplay = true;
  }

  closeDiscountDialog() {
    this.billCollectionId = null;
    this.discount.discount = null;
    this.discountDisplay = false;
    this.discounted_bill = null;
  }

  calculatePaid(discount) {
    this.discounted_bill = this.total_bill - discount;
  }

  onDiscountSubmit() {
    this.internetBillCollectionService
      .discount(this.billCollectionId, this.discount)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadBillCollectionLazy(this.billCollectionLazyEvent);
      });
    this.closeDiscountDialog();
  }

  showRefundDialog(billCollectionId) {
    this.billCollectionId = billCollectionId;
    this.refundDisplay = true;
  }

  onRefundSubmit() {
    this.internetBillCollectionService
      .refund(this.billCollectionId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadBillCollectionLazy(this.billCollectionLazyEvent);
      });
    this.closeRefundDialog();
  }

  closeRefundDialog() {
    this.refundDisplay = false;
  }

  generateReport(reportType) {
    this.reportService
      .download(
        reportType,
        'internet_bill_collections',
        this.billCollectionLazyEvent
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'internet_bill_collections' +
            moment().format('DD_MM_YYYY_HH_mm_s') +
            '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], { type: 'text/xlsx' });
          filename =
            'internet_bill_collections' +
            moment().format('DD_MM_YYYY_HH_mm_s') +
            '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'internet_bill_collections' +
            moment().format('DD_MM_YYYY_HH_mm_s') +
            '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
