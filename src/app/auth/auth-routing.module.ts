import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { AuthGuard } from '../_guard/auth.guard';
import { UserFormComponent } from './user-form/user-form.component';
import { UserTableComponent } from './user-table/user-table.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleComponent } from './role/role.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'auth_user',
    component: AuthenticatedUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'permissions',
    component: PermissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'permissions/:id/edit',
    component: PermissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    component: RoleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'roles/:id/edit',
    component: RoleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
