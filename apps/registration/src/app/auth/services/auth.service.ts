import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RestClient } from '../../services/rest-client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this.loadUser());
  private readonly _token = signal<string | null>(this.loadToken());

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly currentUser = computed(() => this._user());

  constructor(
    private readonly router: Router,
    private _restClient: RestClient,
  ) {}

  signIn(payload: SignInPayload): Observable<AuthResponse> {
    return this.mockSignIn(payload).pipe(tap((res) => this.persist(res)));
  }

  signUp(payload: SignUpPayload): Observable<AuthResponse> {
    return this._restClient
      .post('auth/signup', payload)
      .pipe(tap((res) => this.persist(res)));
  }

  signOut(): void {
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/auth/signin']);
  }

  private persist(res: AuthResponse): void {
    this._user.set(res.user);
    this._token.set(res.token);
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  private mockSignIn(payload: SignInPayload): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      setTimeout(() => {
        if (payload.email && payload.password.length >= 6) {
          observer.next({
            user: {
              id: crypto.randomUUID(),
              fullName: payload.email.split('@')[0],
              email: payload.email,
            },
            token: `mock_token_${Date.now()}`,
          });
          observer.complete();
        } else {
          observer.error({
            message: 'Invalid credentials. Check your email and password.',
          });
        }
      }, 900);
    });
  }
}
