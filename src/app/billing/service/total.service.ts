import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TotalService {
  constructor(private http: HttpClient) {}

  total_due(event) {
    let params = new HttpParams();

    if (event.filters) {
      event.filters.global
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

      event.filters.internet
        ? (params = params.set('internet', event.filters.internet.value))
        : (params = params);
    }
    return this.http.get('/total_due', { params: params });
  }

  total_bill(event) {
    let params = new HttpParams();

    if (event.filters) {
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

      event.filters.subscription_type
        ? (params = params.set(
        'subscription_type',
        event.filters.subscription_type.value
        ))
        : (params = params);

      event.filters.internet
        ? (params = params.set('internet', event.filters.internet.value))
        : (params = params);
    }
    return this.http.get('/total_bill', { params: params });
  }

  total_fee(event) {
    let params = new HttpParams();

    if (event.filters) {
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

      event.filters.collector
        ? (params = params.set('collector', event.filters.collector.value))
        : (params = params);

      event.filters.subscription_type
        ? (params = params.set(
        'subscription_type',
        event.filters.subscription_type.value
        ))
        : (params = params);

      event.filters.internet
        ? (params = params.set('internet', event.filters.internet.value))
        : (params = params);
    }
    return this.http.get('/total_fee', { params: params });
  }

  target_bill(event) {
    let params = new HttpParams();

    if (event.filters) {
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

      event.filters.collector
        ? (params = params.set('collector', event.filters.collector.value))
        : (params = params);

      event.filters.subscription_type
        ? (params = params.set(
        'subscription_type',
        event.filters.subscription_type.value
        ))
        : (params = params);

      event.filters.internet
        ? (params = params.set('internet', event.filters.internet.value))
        : (params = params);
    }

    return this.http.get('/target_bill', { params: params });
  }
}
