import { ChartOfAccount } from './chart-of-account';

export class ExpenseDetail {
  id: string;
  amount: string;
  expense_id: string;
  chart_of_account_id: string;
  chart_of_account: ChartOfAccount;

  constructor(
    amount: string = '',
    expense_id: string = '',
    chart_of_account_id: string = '',
    chart_of_account: ChartOfAccount = new ChartOfAccount(),
  ) {
    this.amount = amount;
    this.expense_id = expense_id;
    this.chart_of_account_id = chart_of_account_id;
    this.chart_of_account = chart_of_account;
  }
}
