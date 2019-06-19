import { Role } from './role';

export class User {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
  active: boolean;
  roles: Role[];

  constructor(
    name: string = '',
    email: string = '',
    password: string = '',
    password_confirmation: string = '',
    active: boolean = true,
    roles: any[] = []
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.password_confirmation = password_confirmation;
    this.active = active;
    this.roles = roles;
  }
}
