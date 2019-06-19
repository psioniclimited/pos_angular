export class CustomerBillDetail {
  id?: string;
  monthly_charge: number;
  effective_date: string;
  description: string;
  constructor(monthly_bill: number = 0, effective_date: string = '', description: string = ''){
    this.monthly_charge = monthly_bill;
    this.effective_date = effective_date;
    this.description = description;
  }
}
