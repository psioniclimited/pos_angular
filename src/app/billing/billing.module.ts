import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  AutoCompleteModule,
  ChartModule, InputMaskModule, KeyFilterModule,
  MegaMenuModule,
  MultiSelectModule,
  ScrollPanelModule, TabMenuModule
} from 'primeng/primeng';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';
import { SplitButtonModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

import { SubscriptionTypeComponent } from './subscription-type/subscription-type.component';
import { SubscriptionTypeTableComponent } from './subscription-type/subscription-type-table/subscription-type-table.component';
import { SubscriptionTypeFormComponent } from './subscription-type/subscription-type-form/subscription-type-form.component';
import { BillCollectionComponent } from './bill-collection/bill-collection.component';
import { BillCollectionTableComponent } from './bill-collection-table/bill-collection-table.component';
import { AreaComponent } from './area/area.component';
import { AreaFormComponent } from './area/area-form/area-form.component';
import { AreaTableComponent } from './area/area-table/area-table.component';
import { RefundHistoryComponent } from './refund-history/refund-history.component';
import { CustomerDueListComponent } from './customer-due-list/customer-due-list.component';
import { ComplainComponent } from './complain-form/complain.component';
import { ComplainTableComponent } from './complain-table/complain-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeeTypesComponent } from './fee-types/fee-types.component';
import { FeeTypesTableComponent } from './fee-types/fee-types-table/fee-types-table.component';
import { FeeCollectionComponent } from './fee-collection/fee-collection.component';
import { FeeCollectionTableComponent } from './fee-collection-table/fee-collection-table.component';
import { InternetCustomerFormComponent } from './internet-customer-form/internet-customer-form.component';
import { InternetCustomerTableComponent } from './internet-customer-table/internet-customer-table.component';
import { InternetCustomerDueListComponent } from './internet-customer-due-list/internet-customer-due-list.component';
import { InternetBillCollectionTableComponent } from './internet-bill-collection-table/internet-bill-collection-table.component';
import { InternetRefundHistoryComponent } from './internet-refund-history/internet-refund-history.component';
import { ShowCustomerComponent } from './show-customer/show-customer.component';

@NgModule({
  imports: [
    CommonModule,
    BillingRoutingModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    TreeModule,
    PanelModule,
    SplitButtonModule,
    AutoCompleteModule,
    FileUploadModule,
    CalendarModule,
    DialogModule,
    MultiSelectModule,
    SliderModule,
    ScrollPanelModule,
    MegaMenuModule,
    ChartModule,
    TabMenuModule,
    InputMaskModule,
    KeyFilterModule
  ],
  declarations: [
    CustomerFormComponent,
    CustomerTableComponent,
    SubscriptionTypeComponent,
    SubscriptionTypeTableComponent,
    SubscriptionTypeFormComponent,
    BillCollectionComponent,
    BillCollectionTableComponent,
    AreaComponent,
    AreaFormComponent,
    AreaTableComponent,
    RefundHistoryComponent,
    CustomerDueListComponent,
    ComplainComponent,
    ComplainTableComponent,
    DashboardComponent,
    FeeTypesComponent,
    FeeTypesTableComponent,
    FeeCollectionComponent,
    FeeCollectionTableComponent,
    InternetCustomerFormComponent,
    InternetCustomerTableComponent,
    InternetCustomerDueListComponent,
    InternetBillCollectionTableComponent,
    InternetRefundHistoryComponent,
    ShowCustomerComponent
  ]
})
export class BillingModule {
}
