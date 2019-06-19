import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FeeType } from '../../_model/fee-type';
import { FeeTypeService } from '../service/fee-type.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-fee-types',
  templateUrl: './fee-types.component.html',
  styleUrls: ['./fee-types.component.scss']
})
export class FeeTypesComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  feeForm: FormGroup;
  editFee: FeeType;
  feeId: number;

  constructor(
    private feeService: FeeTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editFee = new FeeType();
    this.route.params.subscribe((params: Params) => {
      this.feeId = +params['id'];
      if (this.feeId) {
        this.feeService
          .show(this.feeId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editFee = data;
              console.log(this.editFee);
              this.editFormInit();
            },
            error => {
              console.log(error);
            }
          );
      }
    });
    this.formInit();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  editFormInit() {
    this.feeForm.get('name').setValue(this.editFee.name);
    this.feeForm.get('amount').setValue(this.editFee.amount);
    this.feeForm.get('description').setValue(this.editFee.description);
  }

  private formInit() {
    this.feeForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      amount: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    const feeType = new FeeType(
      this.feeForm.value['name'],
      this.feeForm.value['amount'],
      this.feeForm.value['description']
    );
    if (this.feeForm.valid) {
      if (this.feeId) {
        // call the update function
        this.feeService
          .update(this.feeId, feeType)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate(['/fee-types']));
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.feeService
          .store(feeType)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/fee-types']));
          });
      }
    } else {
      Object.keys(this.feeForm.controls).forEach(field => {
        // {1}
        const control = this.feeForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  onCancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/fee-types']));
  }
}
