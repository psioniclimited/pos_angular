export class Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
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
