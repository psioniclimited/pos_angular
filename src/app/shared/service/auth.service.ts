import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(creds) {
    return this.http.post('/user/login', creds).pipe(
      map(token => {
        // login successful if there's a jwt token in the response
        // @ts-ignore
        if (token && token.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // @ts-ignore
          localStorage.setItem('token', JSON.stringify(token.token));
          // this.router.navigate(['/auth/auth_user']);
          this.router.navigate(['/dashboard']);
        }
        return token;
      })
    );
  }

  isloggedIn() {
    if (localStorage.getItem('token')) {
      // logged in so return true
      this.router.navigate(['/dashboard']);
    }
  }

  logout() {
    return this.http.post('/user/logout', null).pipe(
      map(data => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
    );
  }
}
