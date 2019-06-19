import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Expense } from '../../_model/expense';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Paginate } from '../../_model/paginate';
import { Router } from '@angular/router';
import { ExpenseService } from '../service/expense.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ReportService } from '../../shared/service/report.service';
import { AutoComplete, Calendar, DataTable } from 'primeng/primeng';
import { ChartOfAccount } from '../../_model/chart-of-account';
import { ChartOfAccountService } from '../service/chart-of-account.service';
import { LoaderService } from '../../shared/service/loader.service';
import { Loader } from '../../_model/loader';
import { ReportTypes } from '../../_model/report-types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss']
})
export class ExpenseTableComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  displayDialog = false;
  expenses: Paginate[];
  cols: any[];
  loading = true;
  totalRecords: number;
  from: number;
  to: number;
  expenseLazyEvent: LazyLoadEvent;
  rowExpenseData: Expense = new Expense();
  items: MenuItem[];
  reportTypes: ReportTypes;

  expenseID: any;
  deleteDisplay = false;

  @ViewChild('dt')
  tableData: DataTable;

  // filter section
  expenseTypes: ChartOfAccount[];
  rangeDates: Date[];
  dateFilters: MenuItem[];

  @ViewChild('areaDropdown')
  expenseTypeDropdown: AutoComplete;
  expenseFilter: any;
  @ViewChild('dateFilter')
  calendar: Calendar;
  globalFilter: string;

  constructor(
    private expenseService: ExpenseService,
    private chartOfAccountService: ChartOfAccountService,
    private reportService: ReportService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    this.reportTypes = new ReportTypes();
  }

  ngOnInit() {
    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'description', header: 'Description' },
      // { field: 'paid_with', subfield: 'name', header: 'Paid With' },
      { field: 'expense_type', header: 'Expense Type' },
      { field: 'amount', header: 'Amount' }
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

  loadExpensesLazy(event: LazyLoadEvent) {
    this.loaderService.loaderState
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state: Loader) => {
        this.loading = state.show;
      });
    this.expenseLazyEvent = event;
    this.expenseService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.totalRecords = data.total;
        this.from = data.from;
        this.to = data.to;
        this.expenses = data.data;
      });
  }

  getExpenseTypes(event) {
    const global = event.query;
    const filters = { parent_accounts: '1' };
    this.chartOfAccountService
      .index(filters)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(accounts => {
        const filters2 = { parent_account_id: accounts[3].id, global };
        this.chartOfAccountService
          .index(filters2)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(data => {
            this.expenseTypes = data;
          });
      });
  }

  todayFilter() {
    this.rangeDates = [];
    this.rangeDates.push(moment().toDate());
    // @ts-ignore
    this.expenseLazyEvent.filters.date = this.rangeDates;
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
    this.expenseLazyEvent.filters.date = this.rangeDates;
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
    this.expenseLazyEvent.filters.date = this.rangeDates;
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
    this.expenseLazyEvent.filters.date = this.rangeDates;
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
    this.expenseLazyEvent.filters.date = this.rangeDates;
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
    this.expenseLazyEvent.filters.date = this.rangeDates;
    this.tableData.filter(this.rangeDates, 'created_at', 'equals');
  }

  filterDateRange(event) {
    // @ts-ignore
    this.expenseLazyEvent.filters.date = this.rangeDates;
  }

  clearFilters() {
    this.expenseFilter = null;
    // date filter reset
    this.rangeDates = null;
    this.calendar.value = null;
    this.calendar.inputFieldValue = null;

    this.globalFilter = '';
  }

  onRowSelect(expense: Expense) {
    this.rowExpenseData = expense;
    this.displayDialog = true;
  }

  showDialogToAdd() {
    this.rowExpenseData = new Expense();
    this.displayDialog = true;
  }

  generateReport(reportType) {
    this.reportService
      .download(reportType, 'expenses', this.expenseLazyEvent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        // download file
        let blob;
        let filename;
        if (reportType === this.reportTypes.pdf) {
          blob = new Blob([response], { type: 'application/pdf' });
          filename =
            'expenses_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.pdf'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.xlsx) {
          blob = new Blob([response], { type: 'text/xlsx' });
          filename =
            'expenses_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.xlsx'; // date_report_name.pdf
        } else if (reportType === this.reportTypes.csv) {
          blob = new Blob([response], { type: 'text/csv' }); // mime type
          filename =
            'customers_' + moment().format('DD_MM_YYYY_HH_mm_s') + '.csv'; // date_report_name.pdf
        }
        saveAs(blob, filename);
      });
  }

  showDeleteDialog(customerID) {
    this.expenseID = customerID;
    this.deleteDisplay = true;
  }

  onDeleteSubmit() {
    this.expenseService
      .delete(this.expenseID)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadExpensesLazy(this.expenseLazyEvent);
      });
    this.deleteDisplay = false;
  }

  closeDeleteDialog() {
    this.deleteDisplay = false;
  }
}
