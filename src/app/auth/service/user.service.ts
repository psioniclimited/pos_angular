import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Paginate } from '../../_model/paginate';
import { User } from '../../_model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // users(event): Observable<Paginate> {
  //   // @ts-ignore
  //   let params = new HttpParams()
  //     .set('page', String(event.first / event.rows + 1))
  //     .set('per_page', event.rows);
  //   // .set('global', event.filters.global);
  //   event.filters && event.filters.global
  //     ? (params = params.set('global', event.filters.global.value))
  //     : (params = params);
  //   event.sortField
  //     ? (params = params.set(
  //         'sort_by',
  //         event.sortField + '.' + event.sortOrder
  //       ))
  //     : (params = params);
  //   return this.http.get<Paginate>('/user', { params: params });
  // }

  store(user: User) {
    return this.http.post('/user', user);
  }

  // show all the users
  index(event): Observable<Paginate> {
    // @ts-ignore
    let params = new HttpParams()
      .set('page', String(event.first / event.rows + 1))
      .set('per_page', event.rows);
    if (event) {
      event.rows
        ? (params = params.set('per_page', event.rows))
        : (params = params.set('per_page', '10'));
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
        ? (params = params.set('global', event.query))
        : (params = params);
    }
    return this.http.get<Paginate>('/user', { params: params });
  }

  update(id: number, user: User) {
    return this.http.put('/user/' + id, user);
  }

  show(id: number): Observable<User> {
    return this.http.get<User>('/user/' + id);
  }
}
