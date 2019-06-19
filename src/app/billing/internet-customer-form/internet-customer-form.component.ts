import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Status } from '../../_model/status';
import { User } from '../../_model/user';
import { Area } from '../../_model/area';
import { UserService } from '../../auth/service/user.service';
import { AreaService } from '../service/area.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InternetCustomerService } from '../service/internet-customer.service';
import { takeUntil } from 'rxjs/operators';
import { InternetCustomer } from '../../_model/internet-customer';
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-internet-customer-form',
  templateUrl: './internet-customer-form.component.html',
  styleUrls: ['./internet-customer-form.component.scss']
})
export class InternetCustomerFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  customerForm: FormGroup;
  subscription_details: any[];
  selectedSubscriptionDetail: any;

  statuses: Status[];
  selectedStatus: Status = {
    id: '1',
    name: 'Connected'
  };
  users: User[];
  areas: Area[];
  displayDialog = false;
  due_on: Date;

  editCustomer: InternetCustomer;
  id: number;

  disableForm = false;

  constructor(
    private customerService: CustomerService,
    private internetCustomerService: InternetCustomerService,
    private userService: UserService,
    private areaService: AreaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editCustomer = new InternetCustomer();
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.id) {
        this.internetCustomerService
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

    this.subscription_details = [
      { name: 'Shared', value: '1' },
      { name: 'Dedicated', value: '0' }
    ];

    this.statuses = [
      new Status('1', 'Connected'),
      new Status('0', 'Disconnected'),
      new Status('2', 'Temporarily Disconnected'),
      new Status('3', 'Free'),
    ];

    this.formInit();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  private formInit() {
    this.customerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required),
      email: new FormControl(null),
      phone: new FormControl(null),
      nid: new FormControl(null),
      monthly_charge: new FormControl(null, Validators.required),
      due_on: new FormControl(null, Validators.required),
      shared_id: new FormControl(null),
      bandwidth: new FormControl(null),
      ppoe: new FormControl(null),
      status: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      users: new FormControl(null, Validators.required),
      address: new FormControl(null),
      connection_fee: new FormControl(null, Validators.min(0)),
    });
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

    this.selectedSubscriptionDetail = {};
    if (Number(this.editCustomer.shared) === 1) {
      this.selectedSubscriptionDetail.value = '1';
      this.selectedSubscriptionDetail.name = 'Shared';
    } else {
      this.selectedSubscriptionDetail.value = '0';
      this.selectedSubscriptionDetail.name = 'Dedicated';
    }
    this.customerForm
      .get('shared_id')
      .setValue(this.selectedSubscriptionDetail);

    this.customerForm.get('bandwidth').setValue(this.editCustomer.bandwidth);
    this.customerForm.get('ppoe').setValue(this.editCustomer.ppoe);
    this.customerForm.get('users').setValue(this.editCustomer.users);
    this.customerForm.get('area').setValue(this.editCustomer.area);
    this.customerForm.get('address').setValue(this.editCustomer.address);

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

  onSubmit() {
    if (this.customerForm.valid) {
      const customer = new InternetCustomer(
        this.customerForm.value['name'],
        this.customerForm.value['code'],
        this.customerForm.value['email'],
        this.customerForm.value['phone'],
        this.customerForm.value['nid'],
        this.customerForm.value['monthly_charge'],
        this.customerForm.value['due_on'],
        this.customerForm.value['shared_id'].value,
        this.customerForm.value['bandwidth'],
        this.customerForm.value['ppoe'],
        this.customerForm.value['status'].id,
        this.customerForm.value['address'],
        this.customerForm.value['area'].id,
        this.customerForm.value['users']
      );
      if (this.id) {
        // call the update function
        this.internetCustomerService
          .update(this.id, customer)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router.navigate(['../internet-customer']);
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.internetCustomerService
          .store(customer, this.customerForm.value['connection_fee'])
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/internet-customer']));
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
      .then(() => this.router.navigate(['/internet-customer']));
  }

  showDialog() {
    this.displayDialog = true;
  }

  disableFormValue(event) {
    if (event.value.id === '1' || event.value.id === '3') {
      this.disableForm = false;
    } else if (event.value.id === '0' || event.value.id === '2') {
      this.disableForm = true;
    }
  }
}
