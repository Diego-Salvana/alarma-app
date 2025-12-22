import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login, Register } from '../interfaces';
import { Observable, tap } from 'rxjs';
import { InfoLoginResponse } from '../../shared/interfaces';
import { API_URL } from '../../env';
import { CurrentHouseService } from '../../dashboard/services';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${API_URL}/users`;
  private http = inject(HttpClient);
  private currentHouseService = inject(CurrentHouseService);

  registerUser (userBody: Partial<Register>): Observable<InfoLoginResponse> {
    return this.http.post<InfoLoginResponse>(`${this.baseUrl}/register`, userBody).pipe(
      tap(response => {
        localStorage.setItem('token', response.data.token);
        this.currentHouseService.setUsername(response.data.email);
      })
    );
  }

  loginUser (loginBody: Partial<Login>, rememberMe: boolean) {
    return this.http.post<InfoLoginResponse>(`${this.baseUrl}/login`, loginBody).pipe(
      tap(response => {
        localStorage.setItem('token', response.data.token);
        this.currentHouseService.setUsername(response.data.email);
        
        if (rememberMe) {
          localStorage.setItem('username', response.data.email);
        } else {
          localStorage.removeItem('username');
        }
      })
    );
  }
}
