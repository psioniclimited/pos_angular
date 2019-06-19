import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginLayoutComponent } from './shared/login-layout/login-layout.component';
import { SigninComponent } from './shared/signin/signin.component';
import { HomeLayoutComponent } from './shared/home-layout/home-layout.component';
import { SignUpComponent } from './shared/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    component: LoginLayoutComponent, // {4}
    children: [
      {
        path: 'login',
        component: SigninComponent // {5}
      }
    ]
  },
  // {
  //   path: 'auth',
  //   loadChildren: '../app/auth/auth.module#AuthModule',
  // },
  {
    path: '',
    component: LoginLayoutComponent, // {4}
    children: [
      {
        path: 'sign-up',
        component: SignUpComponent // {5}
      }
    ]
  },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: 'auth', loadChildren: '../app/auth/auth.module#AuthModule' },
      { path: '', loadChildren: '../app/billing/billing.module#BillingModule' },
      { path: '', loadChildren: '../app/accounting/accounting.module#AccountingModule' },
      { path: '', loadChildren: '../app/sales/sales.module#SalesModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
