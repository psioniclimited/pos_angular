export class Client {
  id: string;
  name: string;
  age: string;
  email: string;
  phone: string;
  address: string;
  discount: string;

  constructor(
    name: string = '',
    age: string = '',
    email: string = '',
    phone: string = '',
    address: string = '',
    discount: string = '',
  ) {
    this.name = name;
    this.age = age;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.discount = discount;
  }
}
