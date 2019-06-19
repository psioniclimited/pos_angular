import { Injectable } from '@angular/core';
import { Paginate } from '../../_model/paginate';
import { Observable } from 'rxjs/index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomerStatus } from '../../_model/customer-status';

@Injectable({
  providedIn: 'root'
})
export class CustomerStatusService {

  constructor(private http: HttpClient) { }

  index(event, customer_id): Observable<Paginate> {
    // @ts-ignore
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);
    // .set('global', event.filters.global);
    event.filters.global
      ? (params = params.set('global', event.filters.global.value))
      : (params = params);
    event.sortField
      ? (params = params.set(
      'sort_by',
      event.sortField + '.' + event.sortOrder
      ))
      : (params = params);
    return this.http.get<Paginate>('/customer/' + customer_id + '/status', { params: params });
  }

  store(customerStatus: CustomerStatus, customer_id) {
    return this.http.post('/customer/' + customer_id + '/status', customerStatus);
  }

  update(id,  customerStatus: CustomerStatus) {
    return this.http.put('/customer/customer_status/' + id, customerStatus);
  }
}
