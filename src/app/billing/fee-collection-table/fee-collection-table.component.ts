import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Calendar, DataTable, Dropdown } from 'primeng/primeng';
import { Area } from '../../_model/area';
import { AreaService } from '../service/area.service';
import { ReportService } from '../../shared/service/report.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { FeeCollectionService } from '../service/fee-collection.service';
import { FeeTypeService } from '../service/fee-type.service';
import { FeeType } from '../../_model/fee-type';
import { TotalService } from '../service/total.service';
import { LoaderService } from '../../shared/service/loader.service';
import { Loader } from '../../_model/loader';
import { ReportTypes } from '../../_model/report-types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-fee-collection-table',
  templateUrl: './fee-collection-table.component.html',
  styleUrls: ['./fee-collection-table.component.scss']
})
export class FeeCollectionTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  cols: any[];
  loading = true;
  feeCollections: Paginate[]; // feeCollections
  totalRecords: number;
  from: number;
  to: number;
  printing: MenuItem[];
  feeCollectionId: number; // billCollectionId for refund and discount
  refundDisplay = false;
  feeCollectionLazyEvent: LazyLoadEvent;
  totalFee = 0;
  scrollable = false;
  reportTypes: ReportTypes;

  @ViewChild('dt')
  tableData: DataTable;

  // filter section
  areas: Area[];
  rangeDates: Date[];
  dateFilters: MenuItem[];
  feeTypes: FeeType[];

  globalFiltersArray: any = [
    { name: 'All', value: 'global' },
    { name: 'Code', value: 'code' },
    { name: 'Name', value: 'name' },
    { name: 'Phone', value: 'phone' },
  ];

  selectGlobalFilter = { name: 'All', value: 'global' };

  @ViewChild('areaDropdown')
  areaDropdown: Dropdown;
  areaFilter: any;
  @ViewChild('dateFilter')
  calendar: Calendar;
  @ViewChild('feeTypeDropdown')
  feeTypeDropdown: Dropdown;
  feeTypeFilter: any;
  globalFilter: string;
  previousGlobalFilter: any;

  @ViewChild('dt')
  dataTable: Table;

  constructor(
    private feeCollectionService: FeeCollectionService,
    private totalService: TotalService,
    private areaService: AreaService,
    private feeTypeService: FeeTypeService,
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
      { field: 'created_at', header: 'Timestamp' },
      { field: 'fee_type', header: 'Fee Type' },
      { field: 'total', header: 'Total Fee' }
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
        icon: 'pi pi-refresh',
        command: () => {
          this.todayFilter();
        }
      },
      {
        label: 'Yesterday',
        icon: 'pi pi-times',
        command: () => {
          this.yesterdayFilter();
        }
      },
      {
        label: 'Last 7 days',
        icon: 'pi pi-info',
        command: () => {
          this.last7DaysFilter();
        }
      },
      {
        label: 'Last 30 days',
        icon: 'pi pi-cog',
        command: () => {
          this.last30DaysFilter();
        }
      },
      {
        label: 'This Month',
        icon: 'pi pi-cog',
        command: () => {
          this.thisMonthFilter();
        }
      },
      {
        label: 'Last Month',
        icon: 'pi pi-cog',
        command: () => {
          this.lastMonthFilter();
        }
      }
    ];
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadFeeCollectionLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.feeCollectionLazyEvent = event;
    this.feeCollectionService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.feeCollections = data.data;
      });

    this.totalService
      .total_fee(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalFee = data[0].total;
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

  getFeeTypes(event) {
    this.feeTypeService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(fee_types => {
        this.feeTypes = fee_types.data;
      });
  }

  todayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.feeCollectionLazyEvent.filters.date = this.rangeDates;
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
    this.feeCollectionLazyEvent.filters.date = this.rangeDates;
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
    this.feeCollectionLazyEvent.filters.date = this.rangeDates;
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
    this.feeCollectionLazyEvent.filters.date = this.rangeDates;
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
    this.feeCollectionLazyEvent.filters.date = this.rangeDates;
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
    this.feeCollectionLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'created_at', 'equals');
  }

  filterDateRange(event) {
    // @ts-ignore
    this.feeCollectionLazyEvent.filters.date = this.rangeDates;
  }

  clearFilters() {
    this.areaFilter = null;
    this.feeTypeFilter = null;

    // date filter reset
    this.rangeDates = null;
    this.calendar.value = null;
    this.calendar.inputFieldValue = null;
    this.selectGlobalFilter = { name: 'All', value: 'global' };

    this.globalFilter = '';
  }

  clearGlobal() {
    this.globalFilter = '';
    this.dataTable.filter('', this.previousGlobalFilter, 'contains');
  }

  search(event) {
    console.log(this.selectGlobalFilter);
    this.previousGlobalFilter = this.selectGlobalFilter.value;
    this.dataTable.filter(
      event.target.value,
      this.selectGlobalFilter.value,
      'contains'
    );
  }

  showRefundDialog(billCollectionId) {
    this.feeCollectionId = billCollectionId;
    this.refundDisplay = true;
  }

  onRefundSubmit() {
    this.feeCollectionService
      .refund(this.feeCollectionId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadFeeCollectionLazy(this.feeCollectionLazyEvent);
      });
    this.refundDisplay = false;
  }

  closeRefundDialog() {
    this.refundDisplay = false;
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'fee_collections', this.feeCollectionLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'fee_collections_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], { type: 'text/xlsx' });
          filename =
            'fee_collections_' +
            moment().format('DD_MM_YYYY_HH_mm_s') +
            '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'fee_collections_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
