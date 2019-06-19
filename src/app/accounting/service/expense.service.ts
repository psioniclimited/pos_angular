import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../../_model/expense';
import { Paginate } from '../../_model/paginate';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows || 10);

    event.query ? (params = params.set('global', event.query)) : '';

    event.filters && event.filters.global
      ? (params = params.set('global', event.filters.global.value))
      : (params = params);

    event.filters.expense_type
      ? (params = params.set('expense_type', event.filters.expense_type.value))
      : (params = params);

    event.filters.date
      ? (params = params.set('date', event.filters.date))
      : (params = params);

    event.sortField
      ? (params = params.set(
          'sort_by',
          event.sortField + '.' + event.sortOrder
        ))
      : (params = params);
    return this.http.get<Paginate>('/expense', { params: params });
  }

  store(expense: Expense) {
    return this.http.post<Expense>('/expense', expense);
  }

  show(id: number): Observable<Expense> {
    return this.http.get<Expense>('/expense/' + id);
  }

  update(id: string, expense: Expense) {
    return this.http.put('/expense/' + id, expense);
  }

  delete(id: number) {
    return this.http.delete<Expense>('/expense/' + id);
  }
}
