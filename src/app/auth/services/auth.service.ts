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
  private baseUrl = `${API_URL}/users`;
  private http = inject(HttpClient);

  registerUser (userBody: Partial<Register>): Observable<InfoLoginResponse> {
    return this.http.post<InfoLoginResponse>(`${this.baseUrl}/register`, userBody).pipe(
      tap(response => {
        localStorage.setItem('token', response.data.token);
      })
    );
  }

  loginUser (loginBody: Partial<Login>, rememberMe: boolean) {
    return this.http.post<InfoLoginResponse>(`${this.baseUrl}/login`, loginBody).pipe(
      tap(response => {
        localStorage.setItem('token', response.data.token);
        
        if (rememberMe) {
          localStorage.setItem('username', response.data.email);
        } else {
          localStorage.removeItem('username');
        }
      })
    );
  }
}
