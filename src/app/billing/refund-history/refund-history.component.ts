import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { BillCollectionService } from '../service/bill-collection.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ReportService } from '../../shared/service/report.service';
import { ReportTypes } from '../../_model/report-types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-refund-history',
  templateUrl: './refund-history.component.html',
  styleUrls: ['./refund-history.component.scss']
})
export class RefundHistoryComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  cols: any[];
  loading: boolean;
  refunds: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  items: MenuItem[];
  refundLazyEvent: LazyLoadEvent;
  scrollable = false;
  reportTypes: ReportTypes;

  constructor(
    private billCollectionService: BillCollectionService,
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
      { field: 'no_of_months', header: 'Bill Months' },
      { field: 'deleted_at', header: 'Timestamp' },
      { field: 'collected_by', header: 'Collected By' },
      { field: 'total', header: 'Total Bill' },
      { field: 'discount', header: 'Discount' },
      { field: 'grand_total', header: 'Paid' }
    ];
    this.items = [
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
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadRefundLazy(event: LazyLoadEvent) {
    event.filters.internet = {
      matchMode: 'equals',
      value: false
    };

    this.refundLazyEvent = event;
    this.billCollectionService
      .refund_index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.refunds = data.data;
        this.loading = false;
      });
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'refunds', this.refundLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'refunds_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], { type: 'text/xlsx' });
          filename =
            'refunds_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'refunds_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
