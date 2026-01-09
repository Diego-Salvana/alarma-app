import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login, Register } from '../interfaces';
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
          localStorage.setItem('token', response.data.token);
        
          rememberMe
            ? localStorage.setItem('username', response.data.email)
            : localStorage.removeItem('username');
        })
      );
  }

  verifyEmail (token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-email`, { token });
  }
}
