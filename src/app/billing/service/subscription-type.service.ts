import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Paginate } from '../../_model/paginate';
import { Observable } from 'rxjs';
import { SubscriptionType } from '../../_model/subscription-type';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionTypeService {
  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    let params = new HttpParams();
    if (event) {
      // @ts-ignore
      params
        .set('page', String(event.first / event.rows + 1))
        .set('per_page', event.rows);
      // .set('global', event.filters.global);

      event.query ? (params = params.set('global', event.query)) : '';

      event.filter && event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);
      event.sortField
        ? (params = params.set(
            'sort_by',
            event.sortField + '.' + event.sortOrder
          ))
        : (params = params);
    }
    return this.http.get<Paginate>('/subscription_type', { params: params });
  }

  store(subscriptionType: SubscriptionType) {
    return this.http.post<SubscriptionType>(
      '/subscription_type',
      subscriptionType
    );
  }

  update(id: number, subscriptionType: SubscriptionType) {
    return this.http.put('/subscription_type/' + id, subscriptionType);
  }

  // display one permission
  show(id: number): Observable<SubscriptionType> {
    return this.http.get<SubscriptionType>('/subscription_type/' + id);
  }
}
