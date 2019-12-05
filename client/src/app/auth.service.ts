import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_URL = `${Config.server}/signin`;
  PROF_URL = `${Config.server}/profile`;

  constructor(private http: HttpClient) { }

  signin(email: string, password: string) {
    this.http.post(this.AUTH_URL, {email, password}).subscribe( (result: any) => {
      if(result && result.token) {
        localStorage.setItem('token', result.token);
      }
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  signout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    return this.http.get(this.PROF_URL);
  }
}
