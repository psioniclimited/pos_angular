import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOfAccount } from '../../../_model/chart-of-account';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartOfAccountService } from '../../service/chart-of-account.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { _ } from 'underscore';
import { LazyLoadEvent } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chart-of-account-table',
  templateUrl: './chart-of-account-table.component.html',
  styleUrls: ['./chart-of-account-table.component.scss']
})
export class ChartOfAccountTableComponent implements OnInit, OnDestroy {
  displayDialog: boolean;
  newChartOfAccount: ChartOfAccount;
  chartOfAccounts: ChartOfAccount[];
  cols: any[];
  oldChartEvent: LazyLoadEvent;
  loading: boolean;
  chartOfAccountForm: FormGroup;
  display = false;
  totalRecords: number;
  addClicked: boolean;

  chart_of_accountID: any;
  deleteDisplay = false;

  routeID: any;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private chartOfAccountService: ChartOfAccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' }
    ];
    this.loading = true;
  }

  loadChartOfAccountLazy(event: LazyLoadEvent) {
    this.oldChartEvent = event;
    this.route.params.subscribe((params: Params) => {
      const routeFilter = { parent_account_id: String(+params['id']) };
      this.routeID = String(+params['id']);
      this.chartOfAccountService
        .index(routeFilter)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(accounts => {
          this.chartOfAccounts = accounts;
        });
    });

    // const filters = { parent_accounts: '1' };
    const filters2 = { parent_account_id: this.routeID };
    this.chartOfAccountService
      .index(filters2)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.chartOfAccounts = data;
      });

    this.loading = false;
  }

  initForm() {
    this.chartOfAccountForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      code: new FormControl(null),
      description: new FormControl(null, Validators.required),
      starting_balance: new FormControl(null)
    });
  }

  onSubmit() {
    const chartOfAccount = new ChartOfAccount(
      this.chartOfAccountForm.value['name'],
      this.chartOfAccountForm.value['code'],
      this.chartOfAccountForm.value['description'],
      this.chartOfAccountForm.value['starting_balance']
    );
    const filters = { parent_accounts: '1' };
    this.chartOfAccountService.index(filters).subscribe(accounts => {
      let routeID;
      routeID = this.route.snapshot.paramMap.get('id');
      if (this.chartOfAccountForm.valid) {
        if (_.isUndefined(this.newChartOfAccount.id)) {
          this.chartOfAccountService
            .store(chartOfAccount, routeID)
            .subscribe(response => {
              console.log(response);
              this.displayDialog = false;
              this.loadChartOfAccountLazy(this.oldChartEvent);
            });
          // this.router
          //   .navigateByUrl('/', { skipLocationChange: true })
          //   .then(() => this.router.navigate(['/expense-category']));
        } else {
          this.chartOfAccountService
            .update(this.newChartOfAccount.id, chartOfAccount)
            .subscribe(
              response => {
                console.log(response);
                this.displayDialog = false;
                this.loadChartOfAccountLazy(this.oldChartEvent);
              },
              error => {
                console.log(error);
              }
            );
          // this.router
          //   .navigateByUrl('/', { skipLocationChange: true })
          //   .then(() => this.router.navigate(['/expense-category']));
        }

        this.display = false;
      } else {
        Object.keys(this.chartOfAccountForm.controls).forEach(field => {
          // {1}
          const control = this.chartOfAccountForm.get(field); // {2}
          control.markAsTouched({ onlySelf: true }); // {3}
        });
      }
    });
  }

  showDialogToAdd() {
    this.addClicked = true;
    this.newChartOfAccount = new ChartOfAccount();
    this.chartOfAccountForm.get('name').setValue(this.newChartOfAccount.name);
    this.chartOfAccountForm.get('code').setValue(this.newChartOfAccount.code);
    this.chartOfAccountForm
      .get('description')
      .setValue(this.newChartOfAccount.description);
    this.chartOfAccountForm
      .get('starting_balance')
      .setValue(this.newChartOfAccount.starting_balance);

    this.displayDialog = true;
  }

  // onRowSelect(event) {
  //   this.newChartOfAccount = _.clone(event.data);
  //   this.displayDialog = true;
  // }

  onRowSelect(chartOfAccount: ChartOfAccount) {
    this.newChartOfAccount = _.clone(chartOfAccount);
    this.chartOfAccountForm.get('name').setValue(this.newChartOfAccount.name);
    this.chartOfAccountForm.get('code').setValue(this.newChartOfAccount.code);
    this.chartOfAccountForm
      .get('description')
      .setValue(this.newChartOfAccount.description);
    this.chartOfAccountForm
      .get('starting_balance')
      .setValue(this.newChartOfAccount.starting_balance);

    this.displayDialog = true;
  }

  showDeleteDialog(customerID) {
    this.chart_of_accountID = customerID;
    this.deleteDisplay = true;
  }

  onDeleteSubmit() {
    this.chartOfAccountService
      .delete(this.chart_of_accountID)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        console.log(response);
        this.loadChartOfAccountLazy(this.oldChartEvent);
      });
    this.deleteDisplay = false;
  }

  closeDeleteDialog() {
    this.deleteDisplay = false;
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
