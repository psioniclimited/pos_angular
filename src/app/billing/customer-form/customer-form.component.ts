import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../../_model/customer';
import { Status } from '../../_model/status';
import { SubscriptionTypeService } from '../service/subscription-type.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../auth/service/user.service';
import { User } from '../../_model/user';
import { AreaService } from '../service/area.service';
import { Area } from '../../_model/area';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Dialog } from 'primeng/dialog';
import { FeeType } from '../../_model/fee-type';
import { FeeTypeService } from '../service/fee-type.service';
import * as moment from 'moment';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  customerForm: FormGroup;
  subscription_types: any[];
  selectedSubscriptionType: any = {};
  statuses: Status[];
  selectedStatus: Status = {
    id: '1',
    name: 'Connected'
  };
  users: User[];
  areas: Area[];
  displayDialog = false;
  due_on: Date;
  today = moment().toDate();
  feeTypes: FeeType[];

  editCustomer: Customer;
  id: number;

  disableForm = false;

  @ViewChild('areaDialog')
  areaDialog: Dialog;

  constructor(
    private customerService: CustomerService,
    private subscriptionTypeService: SubscriptionTypeService,
    private userService: UserService,
    private areaService: AreaService,
    private feeTypeService: FeeTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editCustomer = new Customer();
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.id) {
        this.customerService
          .show(this.id)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editCustomer = data;
              this.editFormInit();
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.customerService
          .code_index()
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editCustomer.code = data;
              this.customerForm.get('code').setValue(this.editCustomer.code);
            },
            error => {
              console.log(error);
            }
          );
      }
    });

    this.subscription_types = [
      { name: 'Analog', id: '1' },
      { name: 'Digital', id: '2' }
    ];

    this.statuses = [
      new Status('3', 'Free'),
      new Status('1', 'Connected'),
      new Status('0', 'Disconnected'),
      new Status('2', 'Temporarily Disconnected')
    ];

    this.formInit();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  private formInit() {
    this.customerForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      code: new FormControl(null, Validators.required),
      email: new FormControl(null),
      phone: new FormControl(null),
      nid: new FormControl(null),
      monthly_charge: new FormControl(null, Validators.required),
      due_on: new FormControl(null, Validators.required),
      connection_date: new FormControl(null, Validators.required),
      disconnection_date: new FormControl(null),
      subscription_type: new FormControl(null, Validators.required),
      card_number: new FormControl(null),
      status: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      users: new FormControl(null, Validators.required),
      address: new FormControl(null),
      connections: new FormControl(null),
      reference: new FormControl(null),
      // fee_type: new FormControl(null),
      connection_fee: new FormControl(null, Validators.min(0))
    });
    this.customerForm.get('connection_date').setValue(this.today);
    this.customerForm.get('status').setValue(this.selectedStatus);
  }

  editFormInit() {
    this.customerForm.get('name').setValue(this.editCustomer.name);
    this.customerForm.get('code').setValue(this.editCustomer.code);
    this.customerForm.get('email').setValue(this.editCustomer.email);
    this.customerForm.get('phone').setValue(this.editCustomer.phone);
    this.customerForm.get('nid').setValue(this.editCustomer.nid);
    this.customerForm
      .get('monthly_charge')
      .setValue(this.editCustomer.monthly_bill);
    this.customerForm
      .get('due_on')
      .setValue(new Date(this.editCustomer.due_on));

    this.customerForm
      .get('card_number')
      .setValue(this.editCustomer.card_number);
    this.customerForm.get('users').setValue(this.editCustomer.users);
    this.customerForm.get('area').setValue(this.editCustomer.area);
    this.customerForm.get('address').setValue(this.editCustomer.address);
    this.customerForm
      .get('connections')
      .setValue(this.editCustomer.number_of_connections);
    this.customerForm.get('reference').setValue(this.editCustomer.reference);

    if (Number(this.editCustomer.subscription_type_id) === 1) {
      this.selectedSubscriptionType.id = '1';
      this.selectedSubscriptionType.name = 'Analog';
    } else {
      this.selectedSubscriptionType.id = '2';
      this.selectedSubscriptionType.name = 'Digital';
    }

    this.customerForm
      .get('subscription_type')
      .setValue(this.selectedSubscriptionType);

    this.selectedStatus = new Status();
    if (Number(this.editCustomer.status) === 1) {
      this.selectedStatus.id = '1';
      this.selectedStatus.name = 'Connected';
      this.disableForm = false;
    } else if (Number(this.editCustomer.status) === 2) {
      this.selectedStatus.id = '2';
      this.selectedStatus.name = 'Temporarily Disconnected';
      this.disableForm = true;
    } else if (Number(this.editCustomer.status) === 3) {
      this.selectedStatus.id = '3';
      this.selectedStatus.name = 'Free';
      this.disableForm = false;
    } else {
      this.selectedStatus.id = '0';
      this.selectedStatus.name = 'Disconnected';
      this.disableForm = true;
    }
    this.customerForm.get('status').setValue(this.selectedStatus);
  }

  filterUser(event) {
    this.userService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(users => {
        this.users = users.data;
      });
  }

  filterArea(event) {
    this.areaService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(areas => {
        this.areas = areas.data;
      });
  }

  filterFeeType(event) {
    this.feeTypeService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(fee_types => {
        this.feeTypes = fee_types.data;
      });
  }

  onSubmit() {
    console.log(this.customerForm.get('end_date').valid);
    if (this.customerForm.valid) {
      const customer = new Customer(
        this.customerForm.value['name'],
        this.customerForm.value['code'],
        this.customerForm.value['email'],
        this.customerForm.value['phone'],
        this.customerForm.value['nid'],
        this.customerForm.value['monthly_charge'],
        this.customerForm.value['due_on'],
        this.customerForm.value['connection_date'],
        this.customerForm.value['subscription_type'].id,
        this.customerForm.value['card_number'],
        this.customerForm.value['status'].id,
        this.customerForm.value['address'],
        this.customerForm.value['area'].id,
        this.customerForm.value['users'],
        this.customerForm.value['connections'],
        this.customerForm.value['reference'],
      );
      if (this.id) {
        // call the update function
        this.customerService
          .update(this.id, customer)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router.navigate(['../customer']);
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.customerService
          .store(customer, this.customerForm.value['connection_fee'])
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/customer']));
          });
      }
    } else {
      Object.keys(this.customerForm.controls).forEach(field => {
        // {1}
        const control = this.customerForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  onCancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/customer']));
  }

  disableFormValue(event) {
    if (event.value.id === '1' || event.value.id === '3') {
      this.disableForm = false;
      this.customerForm.get('disconnection_date').setValidators(null);
      this.customerForm.get('disconnection_date').updateValueAndValidity();
    } else if (event.value.id === '0' || event.value.id === '2') {
      this.disableForm = true;
      this.customerForm.get('disconnection_date').setValidators([Validators.required]);
      this.customerForm.get('disconnection_date').updateValueAndValidity();
    }
  }

  showDialog() {
    this.displayDialog = true;
  }

  changeSelectedSubscriptionType(event) {
    if (event.value.id === '1') {
      this.selectedSubscriptionType.id = '1';
      console.log(this.selectedSubscriptionType);
    } else if (event.value.id === '2') {
      this.selectedSubscriptionType.id = '2';
      console.log(this.selectedSubscriptionType);
    }
  }

  // scrollToTop(event) {
  //   this._renderer.setProperty(this.areaDialog.nativeElement, 'scrollTop', this.areaDialog.nativeElement.scrollHeight);
  //   const scrollToTop = window.setInterval(() => {
  //     const pos = window.pageYOffset;
  //     if (pos > 0) {
  //       window.scrollTo(0, pos - 20); // how far to scroll on each step
  //     } else {
  //       window.clearInterval(scrollToTop);
  //     }
  //   }, 16);
  // }
}
