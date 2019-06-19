import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { ChartOfAccountComponent } from './chart-of-account/chart-of-account.component';
import { ChartOfAccountTableComponent } from './chart-of-account/chart-of-account-table/chart-of-account-table.component';
import { ChartOfAccountFormComponent } from './chart-of-account/chart-of-account-form/chart-of-account-form.component';
import { CardModule } from 'primeng/card';
import {
  AutoCompleteModule,
  ButtonModule,
  CalendarModule,
  DialogModule,
  DropdownModule, InputTextModule, KeyFilterModule,
  SplitButtonModule,
  TabMenuModule
} from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { ExpenseFormComponent } from './expense-table/expense-form/expense-form.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalEntryFormComponent } from './journal-entry-form/journal-entry-form.component';

@NgModule({
  imports: [
    CommonModule,
    AccountingRoutingModule,
    TabMenuModule,
    CardModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    SplitButtonModule,
    InputTextModule,
    KeyFilterModule
  ],
  declarations: [
    ChartOfAccountComponent,
    ChartOfAccountTableComponent,
    ChartOfAccountFormComponent,
    ExpenseTableComponent,
    ExpenseFormComponent,
    JournalListComponent,
    JournalEntryFormComponent
  ]
})
export class AccountingModule {}
