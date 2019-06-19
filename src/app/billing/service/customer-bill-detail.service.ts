import { Injectable } from '@angular/core';
import { Paginate } from '../../_model/paginate';
import { Observable } from 'rxjs/index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomerBillDetail } from '../../_model/customer-bill-detail';

@Injectable({
  providedIn: 'root'
})
export class CustomerBillDetailService {

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
    return this.http.get<Paginate>('/customer/' + customer_id + '/bill_detail', { params: params });
  }

  store(customerBillDetail: CustomerBillDetail, customer_id) {
    return this.http.post('/customer/' + customer_id + '/bill_detail', customerBillDetail);
  }

  update(id,  customerBillDetail: CustomerBillDetail) {
    return this.http.put('/customer/bill_detail/' + id, customerBillDetail);
  }
}
