import { ExpenseDetail } from './expense-detail';

export class Expense {
  expense_details: ExpenseDetail[];
  id: string;
  date: string;
  description: string;
  amount: string;
  paid_with_id: string;

  constructor(
    date: string = '',
    description: string = '',
    amount: string = '',
    paid_with_id: string = '',
    expense_details: ExpenseDetail[] = [],
  ) {
    this.date = date;
    this.description = description;
    this.amount = amount;
    this.paid_with_id = paid_with_id;
    this.expense_details = expense_details;
  }
}
