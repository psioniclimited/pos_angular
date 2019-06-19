import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TotalSalesService {
  constructor(private http: HttpClient) {}

  total_paid(event) {
    let params = new HttpParams();

    if (event.filters) {
      event.filters && event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);

      event.filters.date
        ? (params = params.set('date', event.filters.date))
        : (params = params);

    }

    return this.http.get('/total_paid', { params: params });
  }

  total_discount(event) {
    let params = new HttpParams();

    if (event.filters) {
      event.filters && event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);

      event.filters.date
        ? (params = params.set('date', event.filters.date))
        : (params = params);

    }

    return this.http.get('/total_discount', { params: params });
  }

  grand_total(event) {
    let params = new HttpParams();

    if (event.filters) {
      event.filters && event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);

      event.filters.date
        ? (params = params.set('date', event.filters.date))
        : (params = params);

    }

    return this.http.get('/grand_total', { params: params });
  }


}
