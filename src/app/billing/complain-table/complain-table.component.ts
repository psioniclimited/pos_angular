import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Paginate } from '../../_model/paginate';
import { ComplainService } from '../service/complain.service';
import { Dropdown } from 'primeng/primeng';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ReportService } from '../../shared/service/report.service';
import { LoaderService } from '../../shared/service/loader.service';
import { Loader } from '../../_model/loader';
import { ReportTypes } from '../../_model/report-types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-complain-table',
  templateUrl: './complain-table.component.html',
  styleUrls: ['./complain-table.component.scss']
})
export class ComplainTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @ViewChildren('dt')
  table;
  complains: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;
  items: MenuItem[];
  complainLazyEvent: LazyLoadEvent;
  complainID: any;
  deleteDisplay = false;
  reportTypes: ReportTypes;

  // filter section
  complainStatuses: any = [
    { label: 'Open', value: 'Open' },
    { label: 'Closed', value: 'Closed' }
  ];

  @ViewChild('statusDropdown')
  statusDropdown: Dropdown;
  statusFilter: any;
  globalFilter: string;

  constructor(
    private complainService: ComplainService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reportTypes = new ReportTypes();
  }

  ngOnInit() {
    this.cols = [
      { field: 'date', header: 'Complain Date' },
      { field: 'description', header: 'Description' },
      { field: 'code', header: 'Customer Code' },
      { field: 'customer_name', header: 'Customer Name' },
      { field: 'phone', header: 'Customer Phone No.' },
      { field: 'status_name', header: 'Complain Status' }
    ];

    this.items = [
      {
        label: 'Excel',
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

  loadComplainsLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.complainLazyEvent = event;
    this.complainService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(complains => {
        this.totalRecords = complains.total;
        this.from = complains.from;
        this.to = complains.to;
        this.complains = complains.data;
      });
  }

  clearFilters() {
    this.statusFilter = null;
    this.globalFilter = '';
  }

  editComplain(id: number) {
    this.router.navigate(['/complain/', id, 'edit'], {
      relativeTo: this.route
    });
  }

  showDeleteDialog(customerID) {
    this.complainID = customerID;
    this.deleteDisplay = true;
  }

  onDeleteSubmit() {
    this.complainService
      .delete(this.complainID)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadComplainsLazy(this.complainLazyEvent);
      });
    this.deleteDisplay = false;
  }

  closeDeleteDialog() {
    this.deleteDisplay = false;
  }

  closeStatus(id) {
    this.complainService
      .closeComplain(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        this.loadComplainsLazy(this.complainLazyEvent);
      });
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'complains', this.complainLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'complains_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], { type: 'text/xlsx' });
          filename =
            'complains_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'complains_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
