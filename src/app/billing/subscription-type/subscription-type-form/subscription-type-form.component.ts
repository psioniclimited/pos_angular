import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubscriptionTypeService } from '../../service/subscription-type.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SubscriptionType } from '../../../_model/subscription-type';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-subscription-type-form',
  templateUrl: './subscription-type-form.component.html',
  styleUrls: ['./subscription-type-form.component.scss']
})
export class SubscriptionTypeFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  subscriptionTypeForm: FormGroup;
  editSubscriptionType: SubscriptionType;
  id: number;

  constructor(
    private subscriptionTypeService: SubscriptionTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editSubscriptionType = new SubscriptionType();
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.id) {
        this.subscriptionTypeService
          .show(this.id)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editSubscriptionType = data;
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

  private formInit() {
    this.subscriptionTypeForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ])
    });
  }
  // change the id at the later address
  onSubmit() {
    const subscriptionType = new SubscriptionType(
      this.subscriptionTypeForm.value['name']
    );

    if (this.id) {
      // call the update function
      this.subscriptionTypeService
        .update(this.id, subscriptionType)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          response => {
            this.router.navigate(['../subscription-type/create']);
          },
          error => {
            console.log(error);
          }
        );
    } else {
      this.subscriptionTypeService
        .store(subscriptionType)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(response => {
          console.log(response);
          this.router.navigate([
            '../subscription-type/' + response.id + '/edit'
          ]);
        });
    }
  }
}
