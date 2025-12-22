import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap, throwError } from 'rxjs';
import { Casa, HouseResponse, InfoHouseResponse, InfoHousesResponse } from '../../shared/interfaces';
import { ArmedStateResponse, ExclusionSensor, ModalDataTransfer } from '../interfaces';
import { API_URL } from '../../env';

interface UpdateHouseBody {
  nombre?: Casa ['nombre'];
  direccion?: Partial<Casa ['direccion']>;
}

/** Provee acceso a la API para realizar operaciones relacionadas a las casas. */
@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private baseUrl = `${API_URL}/houses`;
  private http = inject(HttpClient);
  private router = inject(Router);
  private houseInfoID = ''; // Id de una casa para ver y modificar sus datos.

  setHouseInfoID (id: string) {
    this.houseInfoID = id;
  }

  /** Obtiene todas las casas del usuario. */
  getAll (): Observable<HouseResponse[]> {
    return this.http.get<InfoHousesResponse>(`${this.baseUrl}`)
      .pipe(map(response => response.data));
  }

  /** Obtiene información de la casa que será utilizada como `currentHouse` y actualiza el `token`. */
  getHouse (houseId: string): Observable<HouseResponse> {
    return this.http.get<InfoHouseResponse>(
      `${this.baseUrl}/${houseId}`, { headers: { 'set-house': 'true' } }
    ).pipe(
      map(response => response.data),
      tap(response => {
        if (response.token) localStorage.setItem('token', response.token);
      })
    );
  }

  /** Obtiene información la casa con id `houseInfoID` para ver y modificar sus datos. */
  getHouseInfo (): Observable<HouseResponse> {
    if (!this.houseInfoID) {
      this.router.navigate(['/dashboard', 'profile']);
      return throwError(() => new Error('No se encontró la casa.'));
    }

    return this.http.get<InfoHouseResponse>(`${this.baseUrl}/${this.houseInfoID}`)
      .pipe(map(response => response.data));
  }

  /** Modifica datos de la casa con id `houseInfoID`. */
  modifyHouse (data: ModalDataTransfer): Observable<HouseResponse> {
    const body: UpdateHouseBody = {
      nombre: data.houseName,
      direccion: {
        calle: data.street,
        numero: isNaN(Number(data.number)) ? undefined : Number(data.number),
        ciudad: data.city
      }
    };

    return this.http
      .patch<InfoHouseResponse>(`${this.baseUrl}/name-dir/${this.houseInfoID}`, body)
      .pipe(map(response => response.data));
  }

  /** Envía solicitud para `activar` la alarma de la casa almacenada en el token. La respuesta de activación se recibe por `websocket`. */
  armAlarm (exclusionArray: ExclusionSensor[]): Observable<ArmedStateResponse> {
    return this.http.post<ArmedStateResponse>(`${this.baseUrl}/arm`, { exclusionArray });
  }

  /** Envía solicitud para `desactivar` la alarma de la casa almacenada en el token. La respuesta de desactivación se recibe por `websocket`. */
  disarmAlarm (): Observable<ArmedStateResponse> {
    return this.http.post<ArmedStateResponse>(`${this.baseUrl}/disarm`, {});
  }
}
