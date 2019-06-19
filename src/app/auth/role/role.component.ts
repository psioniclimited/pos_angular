import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RoleService } from '../service/role.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../_model/role';
import { RolePermissionService } from '../service/role-permission.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  roleForm: FormGroup;
  editRole: Role;
  RoleId: number;

  constructor(
    private roleService: RoleService,
    private rolePermissionService: RolePermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editRole = new Role();
    this.route.params.subscribe((params: Params) => {
      this.RoleId = +params['id'];
      if (this.RoleId) {
        this.roleService
          .show(this.RoleId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editRole = data;
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
    this.roleForm.get('name').setValue(this.editRole.name);
    this.roleForm.get('display_name').setValue(this.editRole.display_name);
    this.roleForm.get('description').setValue(this.editRole.description);
  }

  private formInit() {
    this.roleForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      display_name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const role = new Role(
        this.roleForm.value['name'],
        this.roleForm.value['display_name'],
        this.roleForm.value['description']
      );
      if (this.RoleId) {
        // call the update function
        this.roleService
          .update(this.RoleId, role)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate(['/auth/roles']));
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.roleService
          .store(role)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate(['/auth/roles']));
            },
            error => {
              console.log(error);
            }
          );
      }
    } else {
      Object.keys(this.roleForm.controls).forEach(field => {
        // {1}
        const control = this.roleForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  onCancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/auth/roles']));
  }
}
