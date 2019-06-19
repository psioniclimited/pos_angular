import { EventEmitter, Injectable, Output } from '@angular/core';
import { Permission } from '../../_model/permission';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Paginate } from '../../_model/paginate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private http: HttpClient) {}

  index(event): Observable<Paginate> {
    // @ts-ignore
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);
    // .set('global', event.filters.global);
    event.filters.global
      ? (params = params.set('global', event.filters.global.value))
      : (params = params);
    event.sortField
      ? (params = params.set(
          'sort_by',
          event.sortField + '.' + event.sortOrder
        ))
      : (params = params);
    return this.http.get<Paginate>('/user/permission', { params: params });
  }

  store(permission: Permission) {
    return this.http.post<Permission>('/user/permission', permission);
  }

  update(id: number, permission: Permission) {
    return this.http.put('/user/permission/' + id, permission);
  }

  // display one permission
  show(id: number): Observable<Permission> {
    return this.http.get<Permission>('/user/permission/' + id);
  }

}
