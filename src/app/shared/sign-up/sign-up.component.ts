import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUpService } from '../service/sign-up.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignUp } from '../../_model/sign-up';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { LoaderService } from '../service/loader.service';
import { Loader } from '../../_model/loader';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  signUpForm: FormGroup;

  plans: any[];

  newSignUp: SignUp;
  loading = false;

  constructor(
    private signUpService: SignUpService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isloggedIn();

    this.plans = [
      { name: 'সাধারণ - ১০০০ গ্রাহকের জন্য প্রযোজ্য', id: '1' },
      { name: 'অসাধারণ  - ২০০০ গ্রাহকের জন্য প্রযোজ্য', id: '2' },
      { name: 'চমৎকার  - ৫০০০ গ্রাহকের জন্য প্রযোজ্য', id: '3' }
      // { name: 'PLATINUM', id: '4' }
    ];

    this.formInit();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  private formInit() {
    this.signUpForm = new FormGroup({
      companyName: new FormControl(null, [Validators.required]),
      companyPhone: new FormControl(null, [Validators.required]),
      companyAddress: new FormControl(null, [Validators.required]),
      pricing_plan_id: new FormControl(null, [Validators.required]),
      adminName: new FormControl(null, [Validators.required]),
      adminEmail: new FormControl(null, [Validators.required]),
      adminPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
      adminPassword_confirm: new FormControl('', [Validators.required])
    });
    // (formGroup: FormGroup) => {
    //   return PasswordValidator.areEqual(formGroup);
    // }
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.loaderService.loaderState
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((state: Loader) => {
          this.loading = state.show;
        });

      this.newSignUp = new SignUp(
        this.signUpForm.value['companyName'],
        this.signUpForm.value['companyPhone'],
        this.signUpForm.value['companyAddress'],
        this.signUpForm.value['pricing_plan_id'].id,
        this.signUpForm.value['adminName'],
        this.signUpForm.value['adminEmail'],
        this.signUpForm.value['adminPassword'],
        this.signUpForm.value['adminPassword_confirm']
      );

      this.signUpService
        .store(this.newSignUp)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/dashboard']));
          },
          error => {
            console.log(error);
          }
        );
    } else {
      Object.keys(this.signUpForm.controls).forEach(field => {
        // {1}
        const control = this.signUpForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  onCancel() {}
}
