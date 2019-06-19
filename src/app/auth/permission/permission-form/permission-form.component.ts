import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Permission } from '../../../_model/permission';
import { PermissionService } from '../../service/permission.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  permissionForm: FormGroup;
  editPermission: Permission;
  id: number;

  constructor(
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editPermission = new Permission();
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.id) {
        this.permissionService
          .show(this.id)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              this.editPermission = data;
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
    this.permissionForm.get('name').setValue(this.editPermission.name);
    this.permissionForm
      .get('display_name')
      .setValue(this.editPermission.display_name);
    this.permissionForm
      .get('description')
      .setValue(this.editPermission.description);
  }

  private formInit() {
    this.permissionForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      display_name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
  }
  // change the id at the later address
  onSubmit() {
    const permission = new Permission(
      this.permissionForm.value['name'],
      this.permissionForm.value['display_name'],
      this.permissionForm.value['description']
    );
    if (this.permissionForm.valid) {
      if (this.id) {
        // call the update function
        this.permissionService
          .update(this.id, permission)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(
            response => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate(['/auth/permissions']));
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.permissionService
          .store(permission)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(response => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/auth/permissions']));
          });
      }
    } else {
      Object.keys(this.permissionForm.controls).forEach(field => {
        // {1}
        const control = this.permissionForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  onCancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/auth/permissions']));
  }
}
