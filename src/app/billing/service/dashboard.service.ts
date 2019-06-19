import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  index(event) {
    return this.http.get('/dashboard');
  }

  connected_index(event): Observable<Paginate> {
    let params = new HttpParams();
    if (event) {
      params = new HttpParams()
        .set('page', String(event.first / event.rows + 1))
        .set('per_page', event.rows);
    }
    return this.http.get<Paginate>('/connections', { params: params });
  }

  collector_index(event): Observable<Paginate> {
    let params = new HttpParams();
    if (event) {
      params = new HttpParams()
        .set('page', String(event.first / event.rows + 1))
        .set('per_page', event.rows);
    }
    return this.http.get<Paginate>('/collector_ranking', { params: params });
  }
}
