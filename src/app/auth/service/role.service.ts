import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Role } from '../../_model/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
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
    return this.http.get<Paginate>('/user/role', { params: params });
  }

  store(role: Role) {
    return this.http.post<Role>('/user/role', role);
  }

  update(id: number, role: Role) {
    return this.http.put('/user/role/' + id, role);
  }

  // display one permission
  show(id: number): Observable<Role> {
    return this.http.get<Role>('/user/role/' + id);
  }
}
