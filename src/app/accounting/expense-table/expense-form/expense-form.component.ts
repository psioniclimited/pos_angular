import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOfAccount } from '../../../_model/chart-of-account';
import { ExpenseService } from '../../service/expense.service';
import { Expense } from '../../../_model/expense';
import { _ } from 'underscore';
import { ChartOfAccountService } from '../../service/chart-of-account.service';
import { ExpenseDetail } from '../../../_model/expense-detail';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseFormComponent implements OnInit, OnChanges, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input()
  displayDialog: boolean;
  @Output()
  closeDisplayDialog = new EventEmitter<boolean>();
  @Input()
  rowExpenseData: Expense = new Expense();
  rowExpenseDate: Date;
  paidWithAccounts: ChartOfAccount[]; // paidWithAccounts options
  selectedPaidWithAccount = ''; // selectedPaidWithAccount
  expenseAccounts: ChartOfAccount[]; // expenseAccounts
  selectedExpenseAccounts: ExpenseDetail[] = []; // selectedExpenseAccounts
  expenseForm: FormGroup;
  isSplitExpense: boolean;
  matchingAmount: boolean;
  oldRowData: Expense;

  constructor(
    private expenseService: ExpenseService,
    private chartOfAccountService: ChartOfAccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.rowExpenseData.amount) {
      if (this.oldRowData === this.rowExpenseData) {
        this.ngOnInit();
        // this.rowExpenseData = this.oldRowData;
      }
      this.oldRowData = this.rowExpenseData;
      this.editFormInit();
      // this.rowExpenseDate = new Date(this.rowExpenseData.date);
      // @ts-ignore
      // this.selectedPaidWithAccount = this.rowExpenseData.paid_with;
    } else {
      this.initForm();
      this.selectedExpenseAccounts = [];
      this.selectedExpenseAccounts.push(new ExpenseDetail());
      // this.rowExpenseDate = null;
      // this.selectedPaidWithAccount = '';
      this.isSplitExpense = false;
    }
  }

  ngOnInit() {
    this.rowExpenseData = new Expense();
    // this.selectedExpenseAccounts.push(new ExpenseDetail());
    this.initForm();
    // const expenseDetail = this.expenseForm.get('expenseDetail') as FormArray;
    // expenseDetail.push(this.createExpenseDetail());

    const filters = { is_payment_account: '1' };
    this.chartOfAccountService
      .index(filters)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(chartOfAccounts => {
        this.paidWithAccounts = chartOfAccounts;
      });
    const filters2 = { parent_accounts: '1' };
    this.chartOfAccountService
      .index(filters2)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(accounts => {
        const filters3 = { parent_account_id: accounts[3].id };
        this.chartOfAccountService
          .index(filters3)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(chartOfAccounts => {
            this.expenseAccounts = chartOfAccounts;
          });
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  editFormInit() {
    // this.expenseForm.get('date').setValue(new Date(this.rowExpenseData.date));
    // this.expenseForm.get('description').setValue(this.rowExpenseData.description);
    // this.expenseForm.get('amount').setValue(this.rowExpenseData.amount);
    // this.expenseForm.get('paid_with_id').setValue(this.rowExpenseData.paid_with);
    // // this.selectedExpenseAccounts = this.rowExpenseData.expense_details;
    // const expenseDetail = this.expenseForm.get('expenseDetail') as FormArray;
    // expenseDetail.removeAt(0);
    // for (let i = 0; i < this.rowExpenseData.expense_details.length; i++) {
    //   expenseDetail.push(new FormGroup({
    //     expenseCategory: new FormControl(this.rowExpenseData.expense_details[i].chart_of_account, Validators.required),
    //     splitAmount: new FormControl(this.rowExpenseData.expense_details[i].amount, Validators.required)
    //   }));
    //   // expenseDetail.at(i).get('expenseCategory').setValue(this.rowExpenseData.expense_details[i].chart_of_account);
    //   // expenseDetail.at(i).get('splitAmount').setValue(this.rowExpenseData.expense_details[i].amount);
    // }
    // console.log(expenseDetail);
    //
    const expenseDetailFormGroup = [];
    for (let i = 0; i < this.rowExpenseData.expense_details.length; i++) {
      expenseDetailFormGroup.push(
        new FormGroup({
          expenseCategory: new FormControl(
            this.rowExpenseData.expense_details[i].chart_of_account,
            Validators.required
          ),
          splitAmount: new FormControl(
            this.rowExpenseData.expense_details[i].amount,
          )
        })
      );
    }

    this.expenseForm = new FormGroup({
      date: new FormControl(
        new Date(this.rowExpenseData.date),
        Validators.required
      ),
      description: new FormControl(
        this.rowExpenseData.description,
        Validators.required
      ),
      amount: new FormControl(this.rowExpenseData.amount, Validators.required),
      paid_with_id: new FormControl(
        // @ts-ignore
        this.rowExpenseData.paid_with,
        Validators.required
      ),
      expenseDetail: new FormArray(expenseDetailFormGroup)
    });
    this.selectedExpenseAccounts = this.rowExpenseData.expense_details;
    this.isSplitExpense = this.rowExpenseData.expense_details.length > 1;
  }

  initForm() {
    this.expenseForm = new FormGroup({
      date: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
      paid_with_id: new FormControl(null, Validators.required),
      expenseDetail: new FormArray([
        new FormGroup({
          expenseCategory: new FormControl(null, Validators.required),
          splitAmount: new FormControl(null)
        })
      ])
    });
  }

  createExpenseDetail(): FormGroup {
    return new FormGroup({
      expenseCategory: new FormControl(null, Validators.required),
      splitAmount: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    // let routeID;
    // routeID = this.route.snapshot.paramMap.get('id');

    if (
      this.expenseForm.controls['date'].valid &&
      this.expenseForm.controls['description'].valid &&
      this.expenseForm.controls['amount'].valid &&
      this.expenseForm.controls['paid_with_id'].valid &&
      this.expenseForm.get('expenseDetail').valid
    ) {
      const date = new Date(this.expenseForm.value['date']);

      const expense = new Expense(
        date.toDateString(),
        this.expenseForm.value['description'],
        this.expenseForm.value['amount'],
        this.expenseForm.value['paid_with_id'].id,
        this.expenseForm.value['expenseDetail']
      );

      if (this.selectedExpenseAccounts.length === 1) {
        this.matchingAmount = true;
      }

      if (this.matchingAmount === true) {
        if (
          _.isUndefined(this.rowExpenseData.id) ||
          this.rowExpenseData.id === ''
        ) {
          this.expenseService
            .store(expense)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
              response => {
                this.displayDialogFalse();
              },
              error => {
                console.log(error);
              }
            );
        } else {
          this.expenseService
            .update(this.rowExpenseData.id, expense)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
              response => {
                console.log(response);
                this.displayDialogFalse();
              },
              error => {
                console.log(error);
              }
            );
        }
        // this.matchingAmount = false;
      }
    } else {
      Object.keys(this.expenseForm.controls).forEach(field => {
        // {1}
        const control = this.expenseForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  displayDialogFalse() {
    // this.rowExpenseData = new Expense();
    this.closeDisplayDialog.emit(this.displayDialog);
  }

  onPaidWithSelect(event) {
    // console.log(event);
    // this.selectedPaidWithAccountId = event.value.id;
    // console.log(this.selectedPaidWithAccountId);
  }

  onExpenseSelect(event, index) {
    // this.selectedExpenseAccounts[index] = event.value;
  }

  splitExpense() {
    this.isSplitExpense = true;
    this.selectedExpenseAccounts.push(new ExpenseDetail());

    const expenseDetail = this.expenseForm.get('expenseDetail') as FormArray;
    expenseDetail.push(this.createExpenseDetail());
  }

  deleteExpense() {
    this.selectedExpenseAccounts.splice(-1, 1);
    if (this.selectedExpenseAccounts.length === 1) {
      this.isSplitExpense = false;
    }
  }

  checkAmount() {
    let totalSplitAmount = 0;
    const expenseDetail = this.expenseForm.get('expenseDetail') as FormArray;
    for (let i = 0; i < this.selectedExpenseAccounts.length; i++) {
      totalSplitAmount =
        totalSplitAmount + Number(expenseDetail.at(i).get('splitAmount').value);
    }

    this.matchingAmount =
      Number(this.rowExpenseData.amount) === totalSplitAmount;
  }
}
