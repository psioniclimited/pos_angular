export class Order {
  id: string;
  user_id: string;
  client_id: string;
  total: string;
  discount: string;
  date: string;

  constructor(
    user_id: string = '',
    client_id: string = '',
    total: string = '',
    discount: string = '',
    date: string = ''
  ) {
    this.user_id = user_id;
    this.client_id = client_id;
    this.total = total;
    this.discount = discount;
    this.date = date;
  }
}
