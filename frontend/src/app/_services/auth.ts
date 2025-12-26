import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:9090/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(username: string, password: string): Observable<any> { 
    return this.http.post(AUTH_API + 'signin', { username, password }, httpOptions); 
  }
  register(username: string, email: string, password: string, role: string[]): Observable<any> { 
    return this.http.post(AUTH_API + 'signup', { 
      username, 
      email, 
      password, 
      roles: role
    }, httpOptions); 
  }
  changePassword(username: string, newPassword: string): Observable<any> {
    return this.http.post(AUTH_API + 'change-password', {
      username: username,
      newPassword: newPassword
    } , httpOptions);
  }
  logout(): Observable<any> { 
    return this.http.post(AUTH_API + 'signout', {}, httpOptions); 
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'forgot-password', { email }, httpOptions);
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(AUTH_API + 'reset-password', { token, newPassword }, httpOptions);
  }
}