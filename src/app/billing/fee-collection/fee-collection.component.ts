import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { FeeCollection } from '../../_model/fee-collection';
import { FeeCollectionService } from '../service/fee-collection.service';
import { FeeTypeService } from '../service/fee-type.service';
import { FeeType } from '../../_model/fee-type';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-fee-collection',
  templateUrl: './fee-collection.component.html',
  styleUrls: ['./fee-collection.component.scss']
})
export class FeeCollectionComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  feeCollectionForm: FormGroup;
  feeCollections: FeeCollection[] = [];
  customerData: any[];
  feeTypes: FeeType[];

  constructor(
    private customerService: CustomerService,
    private feeTypeService: FeeTypeService,
    private feeCollectionService: FeeCollectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.feeCollections.push(new FeeCollection());
    this.formInit();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  formInit() {
    this.feeCollectionForm = new FormGroup({
      feeCollectionFormArray: new FormArray([this.createBill()])
    });
  }

  createBill(): FormGroup {
    return new FormGroup({
      code: new FormControl(null, Validators.required),
      address: new FormControl(null),
      fee_type: new FormControl(null, Validators.required),
      total: new FormControl(null, [Validators.required, Validators.min(0)])
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
            value.name = value.name + ' - ' + value.code;
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
    const customerCode = event;
    const feeCollectionFormArrayController = this.feeCollectionForm.get(
      'feeCollectionFormArray'
    ) as FormArray;

    this.customerService
      .show(Number(event.id))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.feeCollections[customerCounter].customer = data;
          this.feeCollections[customerCounter].customer_id = data.id;
          feeCollectionFormArrayController
            .at(customerCounter)
            .get('code')
            .setValue(customerCode);
          feeCollectionFormArrayController
            .at(customerCounter)
            .get('address')
            .setValue(this.feeCollections[customerCounter].customer.address);
        },
        error => {
          console.log(error);
        }
      );
  }

  filterFeeType(event) {
    this.feeTypeService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(fee_types => {
        this.feeTypes = fee_types.data;
      });
  }

  selectFeeType(event, customerCounter) {
    const feeCollectionFormArrayController = this.feeCollectionForm.get(
      'feeCollectionFormArray'
    ) as FormArray;

    this.feeTypeService
      .show(Number(event.id))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.feeCollections[customerCounter].fee_type_id = data.id;
          this.feeCollections[customerCounter].total = data.amount;
          feeCollectionFormArrayController
            .at(customerCounter)
            .get('total')
            .setValue(data.amount);
        },
        error => {
          console.log(error);
        }
      );
  }

  editTotal(total, customerCounter) {
    this.feeCollections[customerCounter].total = total;
  }

  onSubmit() {
    if (this.feeCollectionForm.get('feeCollectionFormArray').valid) {
      this.feeCollectionService.store(this.feeCollections).subscribe(
        response => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/collect-fee']));
        },
        error => {
          console.log(error);
        }
      );
    } else {
      const controlArray = this.feeCollectionForm.controls[
        'feeCollectionFormArray'
        // @ts-ignore
      ].controls;

      Object.keys(controlArray).forEach(field => {
        controlArray[field].controls['code'].markAsTouched(true);
        controlArray[field].controls['fee_type'].markAsTouched(true);
        controlArray[field].controls['total'].markAsTouched(true);
      });
    }
  }

  addNewBill() {
    this.feeCollections.push(new FeeCollection());
    const feeCollectionFormArray = this.feeCollectionForm.get(
      'feeCollectionFormArray'
    ) as FormArray;
    feeCollectionFormArray.push(this.createBill());
  }

  deleteBill(event) {
    this.feeCollections.splice(event, 1);
    const feeCollectionFormArray = this.feeCollectionForm.get(
      'feeCollectionFormArray'
    ) as FormArray;
    feeCollectionFormArray.removeAt(event);
  }
}
