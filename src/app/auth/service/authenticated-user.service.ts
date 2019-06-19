import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../_model/user';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserService {

  constructor(private http: HttpClient) { }

  getAuthenticatedUser(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/user/get_auth_user');
  }
}
