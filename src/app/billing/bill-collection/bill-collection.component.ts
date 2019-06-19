import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../service/customer.service';
import { map, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { BillCollection } from '../../_model/bill-collection';
import { BillCollectionService } from '../service/bill-collection.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bill-collection',
  templateUrl: './bill-collection.component.html',
  styleUrls: ['./bill-collection.component.scss']
})
export class BillCollectionComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  billCollectionForm: FormGroup;
  billCollections: BillCollection[] = [];
  customerData: any[];

  constructor(
    private customerService: CustomerService,
    private billCollectionService: BillCollectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.billCollections.push(new BillCollection());
    this.formInit();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  formInit() {
    this.billCollectionForm = new FormGroup({
      billCollectionFormArray: new FormArray([this.createBill()])
    });
  }

  createBill(): FormGroup {
    return new FormGroup({
      code: new FormControl(null, Validators.required),
      address: new FormControl(null),
      due_on: new FormControl(null),
      no_of_months: new FormControl({ value: null, disabled: true }, [
        Validators.required
      ]),
      total_due: new FormControl(null),
      discount: new FormControl({ value: null, disabled: true }, Validators.min(0)),
      total: new FormControl(null, [Validators.required])
    });
  }

  filterCustomer(event) {
    event.filters = {
      status
    };

    event.filters.status = {
      matchMode: 'equals',
      value: 1
    };

    this.customerService
      .index(event)
      .pipe(
        map(customers => {
          return customers.data.map(value => {
            value.name = value.name + ' - ' + value.code + ' - ' + value.phone;
            return value;
          });
        })
      )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.customerData = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  selectCustomer(event, customerCounter) {
    const customer = event;
    this.billCollections[customerCounter].customer = event;
    const billCollectionFormArrayController = this.billCollectionForm.get(
      'billCollectionFormArray'
    ) as FormArray;

    billCollectionFormArrayController
      .at(customerCounter)
      .get('no_of_months')
      .setValue(null);
    billCollectionFormArrayController
      .at(customerCounter)
      .get('discount')
      .setValue(null);
    billCollectionFormArrayController
      .at(customerCounter)
      .get('total')
      .setValue(null);

    const no_of_months_control = billCollectionFormArrayController
      .at(customerCounter)
      .get('no_of_months');
    no_of_months_control.disabled ? no_of_months_control.enable() : '';

    const discount_control = billCollectionFormArrayController
      .at(customerCounter)
      .get('discount');
    discount_control.disabled ? discount_control.enable() : '';

    billCollectionFormArrayController
      .at(customerCounter)
      .get('code')
      .setValue(customer);
    billCollectionFormArrayController
      .at(customerCounter)
      .get('address')
      .setValue(this.billCollections[customerCounter].customer.address);
    billCollectionFormArrayController
      .at(customerCounter)
      .get('due_on')
      .setValue(this.billCollections[customerCounter].customer.due_on);

    if (
      moment().diff(
        this.billCollections[customerCounter].customer.due_on,
        'months'
      ) < 0
    ) {
      billCollectionFormArrayController
        .at(customerCounter)
        .get('total_due')
        .setValue(0);
    } else {
      billCollectionFormArrayController
        .at(customerCounter)
        .get('total_due')
        .setValue(
          (moment().diff(
            this.billCollections[customerCounter].customer.due_on,
            'months'
          ) +
            1) *
            Number(this.billCollections[customerCounter].customer.monthly_bill)
        );
    }
  }

  calculatePaid(numberOfMonths, customerCounter) {
    const due_on = moment(
      this.billCollections[customerCounter].customer.due_on,
      'YYYY-MM-DD'
    );
    const payUpTo = moment(
      this.billCollections[customerCounter].customer.due_on,
      'YYYY-MM-DD'
    ).add(numberOfMonths, 'month');

    this.billCollections[customerCounter].no_of_months = numberOfMonths;

    let totalBill = 0.0;
    let currentBill: number;

    currentBill = Number(
      this.billCollections[customerCounter].customer.monthly_bill
    );

    while (due_on.isBefore(payUpTo)) {
      totalBill += currentBill;
      due_on.add(1, 'month');
    }
    this.billCollections[customerCounter].total = totalBill;
    const billCollectionFormArrayController = this.billCollectionForm.get(
      'billCollectionFormArray'
    ) as FormArray;
    billCollectionFormArrayController
      .at(customerCounter)
      .get('total')
      .setValue(
        this.billCollections[customerCounter].total -
          this.billCollections[customerCounter].discount
      );
  }

  calculateDiscount(discount, customerCounter) {
    this.billCollections[customerCounter].discount = discount;
    const billCollectionFormArrayController = this.billCollectionForm.get(
      'billCollectionFormArray'
    ) as FormArray;
    billCollectionFormArrayController
      .at(customerCounter)
      .get('total')
      .setValue(
        this.billCollections[customerCounter].total -
          this.billCollections[customerCounter].discount
      );
  }

  onSubmit() {
    if (this.billCollectionForm.get('billCollectionFormArray').valid) {
      this.billCollectionService
        .store(this.billCollections)
        // .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/customer/collect-bill']));
          },
          error => {
            console.log(error);
          }
        );
    } else {
      const controlArray = this.billCollectionForm.controls[
        'billCollectionFormArray'
        // @ts-ignore
      ].controls;

      Object.keys(controlArray).forEach(field => {
        controlArray[field].controls['code'].markAsTouched(true);
        controlArray[field].controls['no_of_months'].markAsTouched(true);
      });
    }
  }

  addNewBill() {
    this.billCollections.push(new BillCollection());
    const billCollectionFormArray = this.billCollectionForm.get(
      'billCollectionFormArray'
    ) as FormArray;
    billCollectionFormArray.push(this.createBill());
  }

  deleteBill(event) {
    this.billCollections.splice(event, 1);
    const billCollectionFormArray = this.billCollectionForm.get(
      'billCollectionFormArray'
    ) as FormArray;
    billCollectionFormArray.removeAt(event);
  }
}
