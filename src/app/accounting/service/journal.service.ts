import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { Journal } from '../../_model/journal';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(private http: HttpClient) { }

  index(event): Observable<Paginate> {
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows || 10);

    event.query ? (params = params.set('global', event.query)) : '';

    event.filters && event.filters.global
      ? (params = params.set('global', event.filters.global.value))
      : (params = params);

    event.filters.date
      ? (params = params.set('date', event.filters.date))
      : (params = params);

    event.sortField
      ? (params = params.set(
      'sort_by',
      event.sortField + '.' + event.sortOrder
      ))
      : (params = params);
    return this.http.get<Paginate>('/journal', { params: params });
  }

  store(journal: Journal) {
    return this.http.post<Journal>('/journal', journal);
  }

  show(id: number): Observable<Journal> {
    return this.http.get<Journal>('/journal/' + id);
  }

  update(id: string, journal: Journal) {
    return this.http.put('/journal/' + id, journal);
  }

  delete(id: number) {
    return this.http.delete<Journal>('/journal/' + id);
  }
}
