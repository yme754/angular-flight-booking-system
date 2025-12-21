import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private USER_KEY = 'auth-user';
  private TOKEN_KEY = 'auth-token';

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));

    if (user.token) {
      this.saveToken(user.token);
    }
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : {};
  }

  public saveToken(token: string): void {
    window.sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(this.TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!window.sessionStorage.getItem(this.USER_KEY);
  }
}
