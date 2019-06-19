import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartOfAccount } from '../../../_model/chart-of-account';

@Component({
  selector: 'app-chart-of-account-form',
  templateUrl: './chart-of-account-form.component.html',
  styleUrls: ['./chart-of-account-form.component.scss']
})
export class ChartOfAccountFormComponent implements OnInit {
  constructor() {}
  account;
  accountForm: FormGroup;
  display = false;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.accountForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      starting_balance: new FormControl(null, Validators.required),
      payment: new FormControl(null, Validators.required)
    });
  }

  showDialog() {
    this.display = true;
  }

  onSubmit() {
    const account = new ChartOfAccount(
      this.accountForm.value['name'],
      '',
      this.account
    );
    this.display = false;
    // this.accountservice.store(account).subscribe(data => {
    //   console.log(data);
    // });
  }
}
