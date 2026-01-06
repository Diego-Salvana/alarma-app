import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { InfoProfileResponse, ProfileResponse, User } from '../../shared/interfaces';
import { ModalDataTransfer, PasswordBody } from '../interfaces';
import { API_URL } from '../../env';

/** Provee acceso a la API para realizar operaciones relacionadas al perfil de usuario. */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/users`;

  /** Obtiene el perfil del usuario tomando el ``id`` del ``token``. */
  getUser (): Observable<ProfileResponse> {
    return this.http
      .get<InfoProfileResponse>(this.baseUrl)
      .pipe(map(response => response.data));
  }

  /** Modifica los datos del perfil del usuario. */
  modifyUserData (data: ModalDataTransfer): Observable<ProfileResponse> {
    const body: Partial<Pick<User, 'nombre' | 'apellido' | 'telefono'>> = {
      nombre: data.name,
      apellido: data.lastname,
      telefono: data.phone
    };

    return this.http
      .patch<InfoProfileResponse>(this.baseUrl, body)
      .pipe(map(response => response.data));
  }

  /** Cambia la contraseña del usuario. */
  updateUserPassword (data: ModalDataTransfer): Observable<ProfileResponse> {
    if (!data.password || !data.newPassword) {
      return throwError(() => new Error('Datos no válidos para contraseña.'));
    }

    const body: PasswordBody = {
      contrasenaActual: data.password,
      nuevaContrasena: data.newPassword
    };

    return this.http
      .patch<InfoProfileResponse>(this.baseUrl, body)
      .pipe(map(response => response.data));
  }
}
