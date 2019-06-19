import { Customer } from './customer';

export class BillCollection {
  id: string;
  customer_id: string;
  customer: Customer;
  no_of_months: string;
  total: number;
  discount: number;
  constructor(no_of_months: string = '', total: number = 0, discount = 0) {
    this.no_of_months = no_of_months;
    this.total = total;
    this.discount = discount;
  }
}
