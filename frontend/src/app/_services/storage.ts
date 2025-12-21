import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasUser());
  loggedIn$ = this.loggedInSubject.asObservable();

  clean(): void {
    window.sessionStorage.clear();
    this.loggedInSubject.next(false);
  }

  public saveUser(user: any): void {
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user.token) {
      this.saveToken(user.token);
    }
    this.loggedInSubject.next(true);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : {};
  }

  public saveToken(token: string): void {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return this.hasUser();
  }

  private hasUser(): boolean {
    return !!window.sessionStorage.getItem(USER_KEY);
  }
}
