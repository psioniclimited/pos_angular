import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    // @ts-ignore
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);

    event.rows
      ? params.set('per_page', event.rows)
      : params.set('per_page', '10');
    // .set('global', event.filters.global);

    event.filters && event.filters.global
      ? (params = params.set('global', event.filters.global.value))
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

    event.query
      ? (params = params.set('name', event.query))
      : (params = params);
    return this.http.get<Paginate>('/order', { params: params });
  }

  store() {}

  show(id: number): Observable<any> {
    return this.http.get<any>('/order/' + id);
  }

  update() {}

  delete(id: number) {
    // return this.http.delete<Order>('/customer/' + id);
  }
}
