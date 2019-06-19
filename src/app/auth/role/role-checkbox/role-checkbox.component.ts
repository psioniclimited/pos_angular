import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RolePermissionService } from '../../service/role-permission.service';
import { Permission } from '../../../_model/permission';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-role-checkbox',
  templateUrl: './role-checkbox.component.html',
  styleUrls: ['./role-checkbox.component.scss']
})
export class RoleCheckboxComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  permissions: Permission[];
  roleId: number;
  @Input()
  selectedPermissions: any[] = [];
  constructor(
    private rolePermissionService: RolePermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.roleId = +params['id'];
      this.selectedPermissions = [];
      if (this.roleId) {
        this.rolePermissionService
          .index(this.roleId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(permissions => {
            this.permissions = permissions;
            for (const permission of permissions) {
              if (permission.roles.length !== 0) {
                this.selectedPermissions.push(String(permission.id));
              }
            }
          });
      }
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  getSelectedPermissions() {
    this.rolePermissionService
      .store(this.roleId, this.selectedPermissions)
      .subscribe(data => {
        console.log(data);
      });
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/auth/roles']));
  }
}
