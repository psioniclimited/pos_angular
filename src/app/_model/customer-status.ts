export class CustomerStatus {
  id?: string;
  status: string;
  effective_date: string;
  description: string;
  constructor(
    status: string = '',
    effective_date: string = '',
    description: string = ''
  ) {
    this.status = status;
    this.effective_date = effective_date;
    this.description = description;
  }
}
