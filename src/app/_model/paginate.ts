export class Paginate {
  current_page: number;
  data: Array<any>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;

  constructor(current_page: number,
  data: Array<any>,
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  next_page_url: string,
  path: string,
  per_page: number,
  prev_page_url: string,
  to: number,
  total: number) {
    this.current_page = current_page;
    this.data = data;
    this.first_page_url = first_page_url;
    this.from = from;
    this.last_page = last_page;
    this.last_page_url = last_page_url;
    this.next_page_url = next_page_url;
    this.path = path;
    this.per_page = per_page;
    this.prev_page_url = prev_page_url;
    this.to = to;
     this.total = total;
  }
}
