import { Injectable } from '@angular/core';
import { SignUp } from '../../_model/sign-up';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  constructor(private http: HttpClient) {}

  store(signUp: SignUp) {
    console.log(signUp);
    return this.http.post('/signup', signUp);
  }
}
