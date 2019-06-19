import { ComplainStatus } from './complain-status';
import { Customer } from './customer';

export class Complain {
  id: string;
  date: string;
  complain_status_id: string;
  description: string;
  customer_id: string;
  complain_status: ComplainStatus;
  customer: Customer;
  constructor(
    date: string = '',
    complain_status_id: string = '',
    description: string = '',
    customer_id: string = ''
  ) {
    this.date = date;
    this.complain_status_id = complain_status_id;
    this.description = description;
    this.customer_id = customer_id;
  }
}
