import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Area } from '../../_model/area';
import { User } from '../../_model/user';
import { AutoComplete, Dropdown } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { ReportTypes } from '../../_model/report-types';
import { AreaService } from '../service/area.service';
import { SubscriptionTypeService } from '../service/subscription-type.service';
import { UserService } from '../../auth/service/user.service';
import { LoaderService } from '../../shared/service/loader.service';
import { ReportService } from '../../shared/service/report.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { InternetCustomerService } from '../service/internet-customer.service';
import { Loader } from '../../_model/loader';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { TotalService } from '../service/total.service';

@Component({
  selector: 'app-internet-customer-table',
  templateUrl: './internet-customer-table.component.html',
  styleUrls: ['./internet-customer-table.component.scss']
})
export class InternetCustomerTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  cols: any[];
  loading = true;
  customers: Paginate[];
  totalRecords: number;
  from: number;
  to: number;
  items: MenuItem[];
  customerLazyEvent: LazyLoadEvent;
  customerID: any;
  deleteDisplay = false;
  targetBill: any;

  // filter section
  areas: Area[];
  connectionStatus: any = [
    { name: 'Connected', id: '1' },
    { name: 'Disconnected', id: '0' },
    { name: 'Temporarily Disconnected', id: '2' },
    { name: 'Free', id: '3' },
  ];
  billCollectors: User[];

  globalFiltersArray: any = [
    { name: 'All', value: 'global' },
    { name: 'Code', value: 'code' },
    { name: 'Name', value: 'name' },
    { name: 'Phone', value: 'phone' },
    { name: 'Address', value: 'address' }
  ];

  selectGlobalFilter = { name: 'All', value: 'global' };

  @ViewChild('areaDropdown')
  areaDropdown: AutoComplete;
  areaFilter: any;
  @ViewChild('statusDropdown')
  statusDropdown: Dropdown;
  statusFilter: any;
  collectorFilter: any;
  globalFilter: string;
  previousGlobalFilter: any;

  @ViewChild('dt')
  dataTable: Table;

  scrollable = false;
  reportTypes: ReportTypes;

  constructor(
    private internetCustomerService: InternetCustomerService,
    private areaService: AreaService,
    private subscriptionService: SubscriptionTypeService,
    private userService: UserService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private totalService: TotalService,
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
      { field: 'address', header: 'Address' },
      { field: 'shared', header: 'Shared' },
      { field: 'ppoe', header: 'PPOE' },
      { field: 'bandwidth', header: 'Bandwidth' },
      { field: 'status', header: 'Status' },
      { field: 'users_name', header: 'Collectors' },
      { field: 'due_on', header: 'Due on' },
      { field: 'monthly_bill', header: 'Monthly Bill' },
      { field: 'total_due', header: 'Total Due' }
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

    // this.filterAreas(this.customerLazyEvent);
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  loadCustomersLazy(event: LazyLoadEvent) {
    event.filters.internet = {
      matchMode: 'equals',
      value: true
    };
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.customerLazyEvent = event;
    this.internetCustomerService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.customers = data.data;
      });

    this.totalService
      .target_bill(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.targetBill = data;
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

  clearFilters() {
    this.areaFilter = null;
    this.statusFilter = null;
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

  editCustomer(id) {
    this.router.navigate(['/internet-customer/', id, 'edit'], {});
  }

  viewCustomer(id) {
    this.router.navigate(['/internet-customer/', id], {});
  }

  showDeleteDialog(customerID) {
    this.customerID = customerID;
    this.deleteDisplay = true;
  }

  onDeleteSubmit() {
    this.internetCustomerService
      .delete(this.customerID)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadCustomersLazy(this.customerLazyEvent);
      });
    this.deleteDisplay = false;
  }

  closeDeleteDialog() {
    this.deleteDisplay = false;
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'internet_customers', this.customerLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'customers_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          filename =
            'customers_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'customers_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }
}
