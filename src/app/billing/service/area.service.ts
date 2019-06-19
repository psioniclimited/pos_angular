import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { Area } from '../../_model/area';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    let params = new HttpParams();
    if (event) {
      params
        .set('page', String(event.first / event.rows + 1))
        .set('per_page', event.rows);
      // .set('global', event.filters.global);

      event.rows
        ? (params = params.set('per_page', event.rows))
        : (params = params.set('per_page', '30'));

      event.first
        ? (params = params.set('page', String(event.first / event.rows + 1)))
        : '';

      event.query ? (params = params.set('global', event.query)) : '';

      event.filters && event.filters.global
        ? (params = params.set('global', event.filters.global.value))
        : (params = params);

      event.sortField
        ? (params = params.set(
            'sort_by',
            event.sortField + '.' + event.sortOrder
          ))
        : (params = params);
    }
    return this.http.get<Paginate>('/area', { params: params });
  }

  store(area: Area) {
    return this.http.post<Area>('/area', area);
  }

  update(id: number, area: Area) {
    return this.http.put('/area/' + id, area);
  }

  // display one permission
  show(id: number): Observable<Area> {
    return this.http.get<Area>('/area/' + id);
  }

  delete(id: number) {
    return this.http.delete<Area>('/area/' + id);
  }
}
