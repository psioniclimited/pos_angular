import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { InternetCustomer } from '../../_model/internet-customer';

@Injectable({
  providedIn: 'root'
})
export class InternetCustomerService {
  constructor(private http: HttpClient) {}
  index(event): Observable<Paginate> {
    let params = new HttpParams();
    params
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);

    event.query ? (params = params.set('select', event.query)) : '';

    event.rows
      ? (params = params.set('per_page', event.rows))
      : (params = params.set('per_page', '10'));

    event.first
      ? (params = params.set('page', String(event.first / event.rows + 1)))
      : '';

    if (event.filters) {
      event.rows
        ? (params = params.set('per_page', event.rows))
        : (params = params.set('per_page', '10'));

      event.first
        ? (params = params.set('page', String(event.first / event.rows + 1)))
        : '';

      event.filters.internet
        ? (params = params.set('internet', event.filters.internet.value))
        : (params = params);

      event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);

      event.filters.code
        ? (params = params.set('code', event.filters.code.value))
        : (params = params);

      event.filters.name
        ? (params = params.set('name', event.filters.name.value))
        : (params = params);

      event.filters.phone
        ? (params = params.set('phone', event.filters.phone.value))
        : (params = params);

      event.filters.address
        ? (params = params.set('address', event.filters.address.value))
        : (params = params);

      event.filters.area
        ? (params = params.set('area', event.filters.area.value))
        : (params = params);

      event.filters.collector
        ? (params = params.set('collector', event.filters.collector.value))
        : (params = params);

      event.filters.subscription_type
        ? (params = params.set(
            'subscription_type',
            event.filters.subscription_type.value
          ))
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

    return this.http.get<Paginate>('/internet_customer', { params: params });
  }

  store(customer: InternetCustomer, connection_fee) {
    // @ts-ignore
    customer.connection_fee = connection_fee;
    return this.http.post('/internet_customer', customer);
  }

  update(id: number, customer: InternetCustomer) {
    return this.http.put('/internet_customer/' + id, customer);
  }

  // display one permission
  show(id: number): Observable<InternetCustomer> {
    return this.http.get<InternetCustomer>('/internet_customer/' + id);
  }

  delete(id: number) {
    return this.http.delete<InternetCustomer>('/internet_customer/' + id);
  }

  due_index(event): Observable<Paginate> {
    let params = new HttpParams();
    params
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);

    event.query ? (params = params.set('global', event.query)) : '';

    event.rows
      ? (params = params.set('per_page', event.rows))
      : (params = params.set('per_page', '10'));

    event.first
      ? (params = params.set('page', String(event.first / event.rows + 1)))
      : '';

    if (event.filters) {
      event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);

      event.filters.code
        ? (params = params.set('code', event.filters.code.value))
        : (params = params);

      event.filters.name
        ? (params = params.set('name', event.filters.name.value))
        : (params = params);

      event.filters.phone
        ? (params = params.set('phone', event.filters.phone.value))
        : (params = params);

      event.filters.address
        ? (params = params.set('address', event.filters.address.value))
        : (params = params);

      event.filters.area
        ? (params = params.set('area', event.filters.area.value))
        : (params = params);

      event.filters.collector
        ? (params = params.set('collector', event.filters.collector.value))
        : (params = params);

      event.filters.subscription_type
        ? (params = params.set(
            'subscription_type',
            event.filters.subscription_type.value
          ))
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

    return this.http.get<Paginate>('/internet_customer_due', {
      params: params
    });
  }
}
