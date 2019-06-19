import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ReportService } from '../../shared/service/report.service';
import { Loader } from '../../_model/loader';
import { LoaderService } from '../../shared/service/loader.service';
import { ReportTypes } from '../../_model/report-types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  users: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  cols: any[];
  loading = true;
  items: MenuItem[];
  userLazyEvent: LazyLoadEvent;
  reportTypes = new ReportTypes();

  constructor(
    private userService: UserService,
    private reportService: ReportService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'roles_name', header: 'Roles' },
      { field: 'active', header: 'Active' }
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

  loadUsersLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.userService.index(event).subscribe(users => {
      this.userLazyEvent = event;
      this.totalRecords = users.total;
      this.from = users.from;
      this.to = users.to;
      this.users = users.data;
    });
  }

  editUser(id: number) {
    this.router.navigate(['/auth/', id, 'edit'], {
      relativeTo: this.route
    });
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'users', this.userLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename = 'users_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          filename = 'users_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename = 'users_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
