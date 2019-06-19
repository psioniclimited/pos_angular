import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { Customer } from '../../_model/customer';
import { CustomerService } from '../service/customer.service';
import { Complain } from '../../_model/complain';
import { ComplainStatus } from '../../_model/complain-status';
import { ComplainService } from '../service/complain.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-complain',
  templateUrl: './complain.component.html',
  styleUrls: ['./complain.component.scss']
})
export class ComplainComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  complainForm: FormGroup;
  editComplain: Complain;
  complainId: number;
  customerID: any;
  selectedCustomer: Customer;
  customerData: any[];
  customerCode = '';
  complainStatuses: ComplainStatus[];

  constructor(
    private complainService: ComplainService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editComplain = new Complain();
    this.route.params.subscribe((params: Params) => {
      this.complainId = +params['id'];
      if (this.complainId) {
        this.complainService
          .show(this.complainId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editComplain = data;
              this.editFormInit();
            },
            error => {
              console.log(error);
            }
          );
      }
    });
    this.formInit();

    this.complainService
      .status_index()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(complainStatuses => {
        // @ts-ignore
        this.complainStatuses = complainStatuses.data;
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  editFormInit() {
    this.complainForm.get('date').setValue(new Date(this.editComplain.date));
    this.complainForm
      .get('complain_status')
      .setValue(this.editComplain.complain_status);
    this.complainForm
      .get('description')
      .setValue(this.editComplain.description);
    this.complainForm.get('customer').setValue(this.editComplain.customer);
  }

  private formInit() {
    this.complainForm = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      complain_status: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      customer: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    if (this.complainForm.valid) {
      this.editComplain = new Complain(
        this.complainForm.value['date'],
        this.complainForm.value['complain_status'].id,
        this.complainForm.value['description'],
        this.complainForm.value['customer'].id
      );

      if (this.complainId) {
        // call the update function
        this.complainService
          .update(this.complainId, this.editComplain)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router.navigate(['../complain']);
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.complainService
          .store(this.editComplain)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/complain']));
          });
      }
    } else {
      Object.keys(this.complainForm.controls).forEach(field => {
        // {1}
        const control = this.complainForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  onCancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/complain']));
  }

  selectCustomer(event) {
    this.customerCode = event;
    this.customerService
      .show(Number(event.id))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.selectedCustomer = data;
          this.customerID = this.selectedCustomer.id;
        },
        error => {
          console.log(error);
        }
      );
  }

  filterCustomer(event) {
    this.customerService
      .index(event)
      .pipe(
        map(customers => {
          return customers.data.map(value => {
            console.log(value);
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

  onStatusSelect($event) {}
}
