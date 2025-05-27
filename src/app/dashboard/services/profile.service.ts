import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { InfoProfileResponse, ProfileResponse, User } from '../../shared/interfaces';
import { ModalDataTransfer } from '../interfaces';

interface BodyPassword {
  contrasenaActual: string;
  nuevaContrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:5000/api/users';
  private http = inject(HttpClient);

  getUser (): Observable<ProfileResponse> {
    return this.http.get<InfoProfileResponse>(this.baseUrl).pipe(map(response => response.data));
  }

  modifyUserData (data: ModalDataTransfer): Observable<ProfileResponse> {
    const body: Partial<Pick<User, 'nombre' | 'apellido' | 'telefono'>> = {
      nombre: data.name,
      apellido: data.lastname,
      telefono: data.phone
    };

    return this.http.patch<InfoProfileResponse>(this.baseUrl, body).pipe(map(response => response.data));
  }

  updateUserPassword (data: ModalDataTransfer): Observable<ProfileResponse> {
    if (!data.password || !data.newPassword) return throwError(() => new Error('Datos no válidos para contraseña.'));

    const body: BodyPassword = {
      contrasenaActual: data.password,
      nuevaContrasena: data.newPassword
    };

    return this.http.patch<InfoProfileResponse>(this.baseUrl, body).pipe(map(response => response.data));
  }
}
