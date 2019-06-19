export class ChartOfAccount {
  id: string;
  code: string;
  name: string;
  description: string;
  starting_balance: string;

  constructor(
    name: string = '',
    code: string = '',
    description: string = '',
    starting_balance: string = '',
  ) {
    this.name = name;
    this.code = code;
    this.description = description;
    this.starting_balance = starting_balance;
  }
}
