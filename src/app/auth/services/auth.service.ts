import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login, Register } from '../interfaces';
import { map, Observable, tap } from 'rxjs';
import { ApiResponse, TokenResponse, LoginResponse, User } from '../../shared/interfaces';
import { ENV } from '../../env';
import { mapLoginResponseToUser } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${ENV.API_URL}/users`;

  register (userBody: Register): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, userBody);
  }

  login (loginBody: Login, rememberMe: boolean): Observable<User> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, loginBody)
      .pipe(
        tap(({ data }) => {
          if (data.habilitado) localStorage.setItem('token', data.token);
          
          rememberMe
            ? localStorage.setItem('username', data.email)
            : localStorage.removeItem('username');
        }),
        map(({ data }) => mapLoginResponseToUser(data))
      );
  }

  /** Solicita envío de correo de verificación de cuenta */
  sendVerificationEmail (email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/send-verification-email`, { email });
  }

  /** Realiza la verificacion del email, y guarda el sesión token del usuario */
  verifyEmail (token: string): Observable<ApiResponse<TokenResponse>> {
    return this.http
      .post<ApiResponse<TokenResponse>>(`${this.baseUrl}/verify-email`, { token })
      .pipe(tap(({ data }) => localStorage.setItem('token', data.token)));
  }

  /** Solicita envío de correo para restablecer contraseña */
  forgotPassword (email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, { email });
  }

  /** Restablece la contraseña del usuario y guarda el sesión token del usuario */
  resetPassword (token: string, password: string): Observable<ApiResponse<TokenResponse>> {
    return this.http
      .post<ApiResponse<TokenResponse>>(`${this.baseUrl}/reset-password`, { token, password })
      .pipe(tap(({ data }) => localStorage.setItem('token', data.token)));
  }
}
