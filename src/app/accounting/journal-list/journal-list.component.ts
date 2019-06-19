import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Paginate } from '../../_model/paginate';
import { Subject } from 'rxjs';
import { LoaderService } from '../../shared/service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { Loader } from '../../_model/loader';
import { JournalService } from '../service/journal.service';
import { Calendar, DataTable } from 'primeng/primeng';
import * as moment from 'moment';
import { ReportTypes } from '../../_model/report-types';
import { ReportService } from '../../shared/service/report.service';
import { saveAs } from 'file-saver';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss']
})
export class JournalListComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @ViewChild('dt')
  tableData: DataTable;

  journals: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;
  scrollable = false;

  reportTypes: ReportTypes;

  journalLazyEvent: LazyLoadEvent;

  // filters
  rangeDates: Date[];
  dateFilters: MenuItem[];

  @ViewChild('dateFilter')
  calendar: Calendar;

  constructor(
    private journalService: JournalService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reportTypes = new ReportTypes();
    breakpointObserver
      .observe([Breakpoints.TabletPortrait, Breakpoints.Handset])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
        this.scrollable = !!result.matches;
      });
  }

  ngOnInit() {
    this.cols = [
      { field: 'transaction_date', header: 'Date' },
      { field: 'account', header: 'Account' },
      { field: 'note', header: 'Note' },
      { field: 'debit', header: 'Debit' },
      { field: 'credit', header: 'Credit' }
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

  todayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.journalLazyEvent.filters.date = this.rangeDates;
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
    this.journalLazyEvent.filters.date = this.rangeDates;
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
    this.journalLazyEvent.filters.date = this.rangeDates;
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
    this.journalLazyEvent.filters.date = this.rangeDates;
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
    this.journalLazyEvent.filters.date = this.rangeDates;
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
    this.journalLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'created_at', 'equals');
  }

  filterDateRange(event) {
    // @ts-ignore
    this.journalLazyEvent.filters.date = this.rangeDates;
  }

  clearFilters() {
    // date filter reset
    this.rangeDates = null;
    this.calendar.value = null;
    this.calendar.inputFieldValue = null;
  }

  loadJournalsLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });

    this.journalLazyEvent = event;
    this.journalService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.journals = data.data;
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'journals', this.journalLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'journals_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], { type: 'text/xlsx' });
          filename =
            'journals_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'journals_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
