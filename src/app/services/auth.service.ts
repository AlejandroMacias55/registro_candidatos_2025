import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LoginRequest, LoginResponse, AuthState } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3012/registro_candidatura/api/v1/auth/login'; // Reemplaza con tu URL real
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false
  });

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.checkAuthState();
  }

  private checkAuthState() {
    const token = this.cookieService.get('auth_token');
    if (token) {
      // Verificar el token con el backend
      this.validateToken(token).subscribe({
        next: (response) => {
          this.authState.next({
            isAuthenticated: true,
            user: response.user
          });
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  private validateToken(token: string): Observable<LoginResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<LoginResponse>(`${this.apiUrl}/validate-token`, { headers });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials)
      .pipe(
        tap(response => {
          // Guardar el token en una cookie segura
          this.cookieService.set('registro_candidaturas_2025_accessToken', response.tokens.accessToken, {
            secure: true,
            sameSite: 'Strict',
            path: '/'
          });

          this.authState.next({
            isAuthenticated: true,
            user: response.user
          });
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Error en el inicio de sesión'));
        })
      );
  }

  logout(): void {
    this.cookieService.delete('auth_token', '/');
    this.authState.next({
      isAuthenticated: false
    });
  }

  getAuthState(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  getAuthToken(): string {
    return this.cookieService.get('auth_token');
  }
}