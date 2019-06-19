import { User } from './user';
import { Area } from './area';

export class InternetCustomer {
  id?: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  nid: string;
  monthly_bill: string;
  due_on: string;
  shared: string;
  bandwidth: string;
  ppoe: string;
  status: string;
  address: string;
  area_id: string;
  users: User[];
  area: Area;
  total_due: string;

  constructor(
    name: string = '',
    code: string = '',
    email: string = '',
    phone: string = '',
    nid: string = '',
    monthly_bill: string = '',
    due_on: string = '',
    shared: string = '',
    bandwidth: string = '',
    ppoe: string = '',
    status: string = '',
    address: string = '',
    area_id: string = '',
    users: User[] = [],
  ) {
    this.name = name;
    this.code = code;
    this.email = email;
    this.phone = phone;
    this.nid = nid;
    this.monthly_bill = monthly_bill;
    this.due_on = due_on;
    this.shared = shared;
    this.bandwidth = bandwidth;
    this.ppoe = ppoe;
    this.status = status;
    this.address = address;
    this.area_id = area_id;
    this.users = users;
  }
}

