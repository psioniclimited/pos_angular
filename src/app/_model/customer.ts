import { User } from './user';
import { SubscriptionType } from './subscription-type';
import { Area } from './area';

export class Customer {
  id?: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  nid: string;
  monthly_bill: string;
  due_on: string;
  connection_date: string;
  subscription_type_id: string;
  status: string;
  address: string;
  area_id: string;
  subscription_type: SubscriptionType;
  card_number: string;
  users: User[];
  area: Area;
  number_of_connections: string;
  reference: string;
  total_due: string;
  constructor(
    name: string = '',
    code: string = '',
    email: string = '',
    phone: string = '',
    nid: string = '',
    monthly_bill: string = '',
    due_on: string = '',
    connection_date: string = '',
    subscription_type_id: string = '',
    card_number: string = '',
    status: string = '',
    address: string = '',
    area_id: string = '',
    users: User[] = [],
    number_of_connections: string = '',
    reference: string = ''
  ) {
    this.name = name;
    this.code = code;
    this.email = email;
    this.phone = phone;
    this.nid = nid;
    this.monthly_bill = monthly_bill;
    this.due_on = due_on;
    this.connection_date = connection_date;
    this.subscription_type_id = subscription_type_id;
    this.card_number = card_number;
    this.status = status;
    this.address = address;
    this.area_id = area_id;
    this.users = users;
    this.number_of_connections = number_of_connections;
    this.reference = reference;
  }
}
