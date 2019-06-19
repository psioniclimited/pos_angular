import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from './password.validator';
import { User } from '../../_model/user';
import { UserService } from '../service/user.service';
import { RoleService } from '../service/role.service';
import { Role } from '../../_model/role';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  userForm: FormGroup;
  editUser: User;
  userId: number;
  roles: Role[];
  active: boolean;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editUser = new User();
    this.route.params.subscribe((params: Params) => {
      this.userId = +params['id'];
      if (this.userId) {
        this.userService
          .show(this.userId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editUser = data;
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
    this.userForm.get('name').setValue(this.editUser.name);
    this.userForm.get('email').setValue(this.editUser.email);
    this.userForm.get('password').setValue(this.editUser.password);
    this.userForm
      .get('password_confirmation')
      .setValue(this.editUser.password_confirmation);
    this.userForm.get('active').setValue(this.editUser.active);
    this.userForm.get('roles').setValue(this.editUser.roles);
  }

  private formInit() {
    this.userForm = new FormGroup(
      {
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(3)
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(
          '',
          Validators.compose([Validators.minLength(5), Validators.required])
        ),
        password_confirmation: new FormControl('', Validators.required),
        active: new FormControl(true, Validators.required),
        roles: new FormControl('', Validators.required)
      },
      (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      }
    );
  }

  filterUserRoles(event) {
    this.roleService
      .index(event)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(roles => {
        this.roles = roles.data;
      });
  }

  onSubmit() {
    this.editUser = new User(
      this.userForm.value['name'],
      this.userForm.value['email'],
      this.userForm.value['password'],
      this.userForm.value['password_confirmation'],
      this.userForm.value['active'],
      this.userForm.value['roles']
    );
    if (this.userId) {
      if (
        this.userForm.controls['name'].valid &&
        this.userForm.controls['email'].valid &&
        this.userForm.controls['roles'].valid
      ) {
        // call the update function
        this.userService
          .update(this.userId, this.editUser)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate(['/auth/users']));
            },
            error => {
              console.log(error);
            }
          );
      } else {
        Object.keys(this.userForm.controls).forEach(field => {
          // {1}
          const control = this.userForm.get(field); // {2}
          control.markAsTouched({ onlySelf: true }); // {3}
        });
      }
    } else {
      if (
        this.userForm.controls['name'].valid &&
        this.userForm.controls['email'].valid &&
        this.userForm.controls['roles'].valid &&
        this.userForm.controls['password'].valid
      ) {
        this.userService
          .store(this.editUser)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate(['/auth/users']));
            },
            error => {
              console.log(error);
            }
          );
      } else {
        Object.keys(this.userForm.controls).forEach(field => {
          // {1}
          const control = this.userForm.get(field); // {2}
          control.markAsTouched({ onlySelf: true }); // {3}
        });
      }
    }
  }

  onCancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/auth/users']));
  }
}
