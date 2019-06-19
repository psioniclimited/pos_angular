import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartOfAccountComponent } from './chart-of-account/chart-of-account.component';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { AuthGuard } from '../_guard/auth.guard';
import { ChartOfAccountTableComponent } from './chart-of-account/chart-of-account-table/chart-of-account-table.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { JournalEntryFormComponent } from './journal-entry-form/journal-entry-form.component';

const routes: Routes = [
  {
    path: 'chart-of-account/:id',
    component: ChartOfAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expense-category',
    component: ChartOfAccountTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses',
    component: ExpenseTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'journals',
    component: JournalListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'journal-entry',
    component: JournalEntryFormComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule {}
