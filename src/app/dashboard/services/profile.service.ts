import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InfoProfileResponse, NewPassword, PasswordBodyDTO, ProfileResponse, ProfileUpdate, ProfileUpdateDTO } from '../../shared/interfaces';
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
  modifyUserData (data: ProfileUpdate): Observable<ProfileResponse> {
    const body: ProfileUpdateDTO = {
      ...(data.name && { nombre: data.name }),
      ...(data.lastname && { apellido: data.lastname }),
      ...(data.phone && { telefono: data.phone })
    };

    return this.http
      .patch<InfoProfileResponse>(this.baseUrl, body)
      .pipe(map(response => response.data));
  }

  /** Cambia la contraseña del usuario. */
  updateUserPassword (data: NewPassword): Observable<ProfileResponse> {
    const body: PasswordBodyDTO = {
      contrasenaActual: data.currentPassword,
      nuevaContrasena: data.newPassword
    };

    return this.http
      .patch<InfoProfileResponse>(this.baseUrl, body)
      .pipe(map(response => response.data));
  }
}
