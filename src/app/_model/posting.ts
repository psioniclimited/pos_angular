export class Posting {
  id: string;
  transaction_date: string;
  debit: string;
  credit: string;
  chart_of_account_id: string;

  constructor(
    transaction_date: string = '',
    debit: string = '',
    credit: string = '',
    chart_of_account_id: string = '',
  ) {
    this.transaction_date = transaction_date;
    this.debit = debit;
    this.credit = credit;
    this.chart_of_account_id = chart_of_account_id;
  }
}
