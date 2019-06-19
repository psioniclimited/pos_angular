import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import {
  AutoCompleteModule,
  CalendarModule,
  DropdownModule,
  InputTextareaModule,
  PaginatorModule,
  PasswordModule,
  SplitButtonModule
} from 'primeng/primeng';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';


// Components
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserTableComponent } from './user-table/user-table.component';
import { PermissionComponent } from './permission/permission.component';
import { PermissionFormComponent } from './permission/permission-form/permission-form.component';
import { PermissionTableComponent } from './permission/permission-table/permission-table.component';
import { RoleComponent } from './role/role.component';
import { RoleTableComponent } from './role/role-table/role-table.component';
import { RoleCheckboxComponent } from './role/role-checkbox/role-checkbox.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    AutoCompleteModule,
    InputSwitchModule,
    PasswordModule,
    CalendarModule,
    SplitButtonModule,
  ],
  declarations: [
    AuthenticatedUserComponent,
    UserFormComponent,
    UserTableComponent,
    PermissionComponent,
    PermissionFormComponent,
    PermissionTableComponent,
    RoleComponent,
    RoleTableComponent,
    RoleCheckboxComponent,
    ProfileComponent,
  ]
})
export class AuthModule {}
