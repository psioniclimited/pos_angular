import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { FeeCollection } from '../../_model/fee-collection';

@Injectable({
  providedIn: 'root'
})
export class FeeCollectionService {

  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);
    // .set('global', event.filters.global);

    event.filters && event.filters.global
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

    event.filters.area
      ? (params = params.set('area', event.filters.area.value))
      : (params = params);

    event.filters.date
      ? (params = params.set('date', event.filters.date))
      : (params = params);

    event.filters.fee_type
      ? (params = params.set('fee_type', event.filters.fee_type.value))
      : (params = params);

    event.sortField
      ? (params = params.set(
      'sort_by',
      event.sortField + '.' + event.sortOrder
      ))
      : (params = params);
    return this.http.get<Paginate>('/fee_collection', { params: params });
  }
  store(feeCollection: FeeCollection[]) {
    return this.http.post('/fee_collection', feeCollection);
  }
  update() {}

  // refund
  refund(fee_collection_id) {
    return this.http.post(
      '/fee_collection/' + fee_collection_id + '/refund',
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
    return this.http.get<Paginate>('/refund_history', { params: params });
  }
}
