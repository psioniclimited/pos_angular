export class FeeType {
  id: string;
  name: string;
  amount: string;
  description: string;
  constructor(
    name: string = '',
    amount: string = '',
    description: string = ''
  ) {
    this.name = name;
    this.amount = amount;
    this.description = description;
  }
}
