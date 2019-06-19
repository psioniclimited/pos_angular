import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BillCollection } from '../../_model/bill-collection';

@Injectable({
  providedIn: 'root'
})
export class InternetBillCollectionService {
  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);
    // .set('global', event.filters.global);

    event.filters && event.filters.global
      ? (params = params.set('global', event.filters.global.value))
      : (params = params);

    event.filters.internet
      ? (params = params.set('internet', event.filters.internet.value))
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

    event.filters.area
      ? (params = params.set('area', event.filters.area.value))
      : (params = params);

    event.filters.date
      ? (params = params.set('date', event.filters.date))
      : (params = params);

    event.filters.collector
      ? (params = params.set('collector', event.filters.collector.value))
      : (params = params);

    event.sortField
      ? (params = params.set(
          'sort_by',
          event.sortField + '.' + event.sortOrder
        ))
      : (params = params);
    return this.http.get<Paginate>('/bill_collection', { params: params });
  }
  store(billCollection: BillCollection[]) {
    return this.http.post('/bill_collection', billCollection);
  }
  update() {}

  // discount
  discount(bill_collection_id, discount) {
    console.log(discount, bill_collection_id);
    return this.http.post(
      '/bill_collection/' + bill_collection_id + '/discount',
      discount
    );
  }

  // refund
  refund(bill_collection_id) {
    return this.http.post(
      '/bill_collection/' + bill_collection_id + '/refund',
      null
    );
  }

  refund_index(event) {
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);
    // .set('global', event.filters.global);

    event.filters && event.filters.global
      ? (params = params.set('global', event.filters.global.value))
      : (params = params);

    event.sortField
      ? (params = params.set(
          'sort_by',
          event.sortField + '.' + event.sortOrder
        ))
      : (params = params);

    event.filters.internet
      ? (params = params.set('internet', event.filters.internet.value))
      : (params = params);
    return this.http.get<Paginate>('/refund_history', { params: params });
  }
}
