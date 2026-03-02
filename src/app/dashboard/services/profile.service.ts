import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, NewPassword, PasswordBodyDTO, ProfileResponse, ProfileUpdate, ProfileUpdateDTO, User } from '../../shared/interfaces';
import { API_URL } from '../../env';
import { mapProfileResponseToDomain } from '../../shared/utils';

/** Provee acceso a la API para realizar operaciones relacionadas al perfil de usuario. */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/users`;

  /** Obtiene el perfil del usuario tomando el ``id`` del ``token``. */
  getUser (): Observable<User> {
    return this.http
      .get<ApiResponse<ProfileResponse>>(this.baseUrl)
      .pipe(map(({ data }) => mapProfileResponseToDomain(data)));
  }

  /** Modifica los datos del perfil del usuario. */
  modifyUserData (data: ProfileUpdate): Observable<User> {
    const body: ProfileUpdateDTO = {
      ...(data.name && { nombre: data.name }),
      ...(data.lastname && { apellido: data.lastname }),
      ...(data.phone && { telefono: data.phone })
    };

    return this.http
      .patch<ApiResponse<ProfileResponse>>(this.baseUrl, body)
      .pipe(map(({ data }) => mapProfileResponseToDomain(data)));
  }

  /** Cambia la contraseña del usuario. */
  updateUserPassword (data: NewPassword): Observable<User> {
    const body: PasswordBodyDTO = {
      contrasenaActual: data.currentPassword,
      nuevaContrasena: data.newPassword
    };

    return this.http
      .patch<ApiResponse<ProfileResponse>>(this.baseUrl, body)
      .pipe(map(({ data }) => mapProfileResponseToDomain(data)));
  }
}
