import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}

  download(report_type, report_name, event): Observable<any> {
    let params = new HttpParams();
    if (event) {
      if (event.filters) {
        event.filters.global
          ? (params = params.set('global', event.filters.global.value))
          : (params = params);

        event.filters.date_range
          ? (params = params.set('date_range', event.filters.date_range))
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

        event.filters.status
          ? (params = params.set('status', event.filters.status.value))
          : (params = params);

        event.filters.fee_type
          ? (params = params.set('fee_type', event.filters.fee_type.value))
          : (params = params);
      }

      event.sortField
        ? (params = params.set(
            'sort_by',
            event.sortField + '.' + event.sortOrder
          ))
        : (params = params);
    }
    const url =
      '/report/download?report_type=' +
      report_type +
      '&report_name=' +
      report_name;
    return this.http.get(url, {
      params: params,
      responseType: 'blob'
    });
  }
}
