import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmailVerification, Login, PasswordResetResponse, Register } from '../interfaces';
import { Observable, tap } from 'rxjs';
import { InfoLoginResponse } from '../../shared/interfaces';
import { API_URL } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/users`;

  register (userBody: Register): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, userBody);
  }

  login (loginBody: Login, rememberMe: boolean): Observable<InfoLoginResponse> {
    return this.http
      .post<InfoLoginResponse>(`${this.baseUrl}/login`, loginBody)
      .pipe(
        tap(response => {
          if (response.data.habilitado) localStorage.setItem('token', response.data.token);
          
          rememberMe
            ? localStorage.setItem('username', response.data.email)
            : localStorage.removeItem('username');
        })
      );
  }

  /** Solicita envío de correo de verificación de cuenta */
  sendVerificationEmail (email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/send-verification-email`, { email });
  }

  /** Realiza la verificacion del email, y guarda el sesión token del usuario */
  verifyEmail (token: string): Observable<EmailVerification> {
    return this.http
      .post<EmailVerification>(`${this.baseUrl}/verify-email`, { token })
      .pipe(tap(response => localStorage.setItem('token', response.token)));
  }

  /** Solicita envío de correo para restablecer contraseña */
  forgotPassword (email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, { email });
  }

  /** Restablece la contraseña del usuario y guarda el sesión token del usuario */
  resetPassword (token: string, password: string): Observable<PasswordResetResponse> {
    return this.http
      .post<PasswordResetResponse>(`${this.baseUrl}/reset-password`, { token, password })
      .pipe(tap(response => localStorage.setItem('token', response.token)));
  }
}
