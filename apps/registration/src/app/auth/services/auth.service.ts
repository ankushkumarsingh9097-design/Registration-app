import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RestClient } from '../../services/rest-client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  terms: boolean;
}

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly restClient = inject(RestClient);

  private readonly _user = signal<User | null>(this.loadUser());
  private readonly _accessToken = signal<string | null>(this.loadToken(ACCESS_TOKEN_KEY));
  private readonly _refreshToken = signal<string | null>(this.loadToken(REFRESH_TOKEN_KEY));

  readonly user = this._user.asReadonly();
  readonly token = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();
  readonly isLoggedIn = computed(() => !!this._accessToken());
  readonly currentUser = computed(() => this._user());

  signIn(payload: SignInPayload): Observable<AuthResponse> {
    return this.restClient.post('auth/login', payload).pipe(
      map((res) => res as AuthResponse),
      tap((res) => this.persist(res))
    );
  }

  signUp(payload: SignUpPayload): Observable<AuthResponse> {
    return this.restClient.post('auth/signup', payload).pipe(
      map((res) => res as AuthResponse),
      tap((res) => this.persist(res))
    );
  }

  signOut(): void {
    this._user.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/auth/signin']);
  }

  private persist(res: AuthResponse): void {
    this._user.set(res.user);
    this._accessToken.set(res.accessToken);
    this._refreshToken.set(res.refreshToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  private loadToken(key: string): string | null {
    return localStorage.getItem(key);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}

