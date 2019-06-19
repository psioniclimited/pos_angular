import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { FeeType } from '../../_model/fee-type';
import { Area } from '../../_model/area';

@Injectable({
  providedIn: 'root'
})
export class FeeTypeService {
  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    // @ts-ignore
    let params = new HttpParams().set(
      'page',
      String(event.first / event.rows + 1)
    );

    event.rows
      ? params.set('per_page', event.rows)
      : params.set('per_page', '10');
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
    event.query
      ? (params = params.set('name', event.query))
      : (params = params);
    return this.http.get<Paginate>('/fee_type', { params: params });
  }

  store(feeType: FeeType) {
    return this.http.post<FeeType>('/fee_type', feeType);
  }

  update(id: number, feeType: FeeType) {
    return this.http.put('/fee_type/' + id, feeType);
  }

  // display one permission
  show(id: number): Observable<FeeType> {
    return this.http.get<FeeType>('/fee_type/' + id);
  }

  delete(id: number) {
    return this.http.delete<FeeType>('/fee_type/' + id);
  }
}
