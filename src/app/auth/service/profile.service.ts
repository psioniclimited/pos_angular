import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from '../../_model/paginate';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  index(): Observable<Paginate> {
    return this.http.get<Paginate>('/user/profile');
  }
}
