import { Injectable } from '@angular/core';
import { Permission } from '../../_model/permission';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  constructor(private http: HttpClient) {}

  index(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>('/user/role/' + roleId + '/permission');
  }

  store(roleId: number, permissionArray: string[]) {
    return this.http.post('/user/role/' + roleId + '/permission', permissionArray);
  }

  update() {

  }
}
