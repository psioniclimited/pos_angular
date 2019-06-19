import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { OrderTableComponent } from './order-table/order-table.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule, InputTextModule, SplitButtonModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ProductSalesReportComponent } from './product-sales-report/product-sales-report.component';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule,
    CardModule,
    TableModule,
    DialogModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    SplitButtonModule,
    FormsModule
  ],
  declarations: [OrderTableComponent, OrderDetailsComponent, ProductSalesReportComponent]
})
export class SalesModule { }
