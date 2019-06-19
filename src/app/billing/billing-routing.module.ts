import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { SubscriptionTypeComponent } from './subscription-type/subscription-type.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { BillCollectionComponent } from './bill-collection/bill-collection.component';
import { BillCollectionTableComponent } from './bill-collection-table/bill-collection-table.component';
import { AreaComponent } from './area/area.component';
import { RefundHistoryComponent } from './refund-history/refund-history.component';
import { CustomerDueListComponent } from './customer-due-list/customer-due-list.component';
import { AuthGuard } from '../_guard/auth.guard';
import { ComplainComponent } from './complain-form/complain.component';
import { ComplainTableComponent } from './complain-table/complain-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeeTypesComponent } from './fee-types/fee-types.component';
import { FeeCollectionComponent } from './fee-collection/fee-collection.component';
import { FeeCollectionTableComponent } from './fee-collection-table/fee-collection-table.component';
import { InternetCustomerFormComponent } from './internet-customer-form/internet-customer-form.component';
import { InternetCustomerTableComponent } from './internet-customer-table/internet-customer-table.component';
import { InternetCustomerDueListComponent } from './internet-customer-due-list/internet-customer-due-list.component';
import { InternetBillCollectionTableComponent } from './internet-bill-collection-table/internet-bill-collection-table.component';
import { InternetRefundHistoryComponent } from './internet-refund-history/internet-refund-history.component';
import { ShowCustomerComponent } from './show-customer/show-customer.component';

const routes: Routes = [
  {
    path: 'customer',
    component: CustomerTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer/create',
    component: CustomerFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer/:id/edit',
    component: CustomerFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internet-customer',
    component: InternetCustomerTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internet-customer/create',
    component: InternetCustomerFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internet-customer/:id/edit',
    component: InternetCustomerFormComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'customer-due-list',
    component: CustomerDueListComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'internet-customer-due-list',
    component: InternetCustomerDueListComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'customer/collect-bill',
    component: BillCollectionComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'customer/bill-collection',
    component: BillCollectionTableComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'internet-customer/bill-collection',
    component: InternetBillCollectionTableComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'subscription-type/create',
    component: SubscriptionTypeComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'subscription-type/:id/edit',
    component: SubscriptionTypeComponent,
    canActivate: [AuthGuard]
  },

  { path: 'area', component: AreaComponent, canActivate: [AuthGuard] },
  { path: 'area/:id/edit', component: AreaComponent, canActivate: [AuthGuard] },

  {
    path: 'refund-history',
    component: RefundHistoryComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'internet-refund-history',
    component: InternetRefundHistoryComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'complain/create',
    component: ComplainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'complain/:id/edit',
    component: ComplainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'complain',
    component: ComplainTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fee-types',
    component: FeeTypesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fee-types/:id/edit',
    component: FeeTypesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'collect-fee',
    component: FeeCollectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fee-collection',
    component: FeeCollectionTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer/:id',
    component: ShowCustomerComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule {}
