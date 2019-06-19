export class SignUp {
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  pricing_plan_id: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminPassword_confirm: string;

  constructor(
    companyName: string = '',
    companyPhone: string = '',
    companyAddress: string = '',
    pricing_plan_id: string = '',
    adminName: string = '',
    adminEmail: string = '',
    adminPassword: string = '',
    adminPassword_confirm: string = ''
  ) {
    this.companyName = companyName;
    this.companyPhone = companyPhone;
    this.companyAddress = companyAddress;
    this.pricing_plan_id = pricing_plan_id;
    this.adminName = adminName;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
    this.adminPassword_confirm = adminPassword_confirm;
  }
}
