import { Customer } from './customer';

export class FeeCollection {
  id: string;
  customer_id: string;
  customer: Customer;
  fee_type_id: string;
  total: string;
}
