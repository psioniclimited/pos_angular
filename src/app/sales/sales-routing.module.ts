import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guard/auth.guard';
import { OrderTableComponent } from './order-table/order-table.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ProductSalesReportComponent } from './product-sales-report/product-sales-report.component';

const routes: Routes = [
  {
    path: 'order',
    component: OrderTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sales-report',
    component: ProductSalesReportComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
