import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChartOfAccount } from '../../_model/chart-of-account';
import { _ } from 'underscore';
import { ComplainStatus } from '../../_model/complain-status';
import { Complain } from '../../_model/complain';
import { Customer } from '../../_model/customer';

@Injectable({
  providedIn: 'root'
})
export class ComplainService {
  constructor(private http: HttpClient) {}

  status_index(): Observable<ComplainStatus[]> {
    return this.http.get<ComplainStatus[]>('/complain_status');
  }

  index(event): Observable<Paginate> {
    // @ts-ignore
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);
    // .set('global', event.filters.global);
    if (event.filters) {
      event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);

      event.filters.status
        ? (params = params.set('status', event.filters.status.value))
        : (params = params);
    }
    event.sortField
      ? (params = params.set(
          'sort_by',
          event.sortField + '.' + event.sortOrder
        ))
      : (params = params);
    return this.http.get<Paginate>('/complain', { params: params });
  }
  store(complain: Complain) {
    return this.http.post('/complain', complain);
  }
  update(id: number, complain: Complain) {
    return this.http.put('/complain/' + id, complain);
  }
  show(id: number): Observable<Complain> {
    return this.http.get<Complain>('/complain/' + id);
  }

  delete(id: number) {
    return this.http.delete<Complain>('/complain/' + id);
  }

  closeComplain(id: number) {
    return this.http.put<Complain>('/complain_update/' + id, id);
  }
}
