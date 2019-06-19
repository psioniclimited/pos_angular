import { Role } from './role';

export class Permission {
  id: string;
  name: string;
  display_name: string;
  description: string;
  roles: Role[];
  constructor(
    name: string = '',
    display_name: string = '',
    description: string = ''
  ) {
    this.name = name;
    this.display_name = display_name;
    this.description = description;
  }
}
