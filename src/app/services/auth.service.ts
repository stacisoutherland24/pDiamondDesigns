import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(
    this.getInitialAuthState()
  );
  public loggedIn$ = this.loggedInSubject.asObservable();

  get isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  private getInitialAuthState(): boolean {
    // Check if user was authenticated in this session
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  login(): void {
    console.log('AuthService - Setting authentication to true');
    sessionStorage.setItem('isAuthenticated', 'true');
    this.loggedInSubject.next(true);
  }

  logout(): void {
    console.log('AuthService - Setting authentication to false');
    sessionStorage.removeItem('isAuthenticated');
    this.loggedInSubject.next(false);
  }
}
