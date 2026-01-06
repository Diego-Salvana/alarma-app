import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap, throwError } from 'rxjs';
import { HouseResponse, InfoHouseResponse, InfoHousesResponse } from '../../shared/interfaces';
import { ModalDataTransfer, UpdateHouseDto } from '../interfaces';
import { API_URL } from '../../env';

/** Provee acceso a la API para realizar operaciones relacionadas a las casas. */
@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${API_URL}/houses`;
  private houseID: string | null = null; // Id de una casa para ver y modificar sus datos.

  setHouseInfoID (id: string) {
    this.houseID = id;
  }

  /** Obtiene todas las casas del usuario. */
  getAll (): Observable<HouseResponse[]> {
    return this.http
      .get<InfoHousesResponse>(`${this.baseUrl}`)
      .pipe(map(response => response.data));
  }

  /** Obtiene información de la casa que será utilizada como `currentHouse` y actualiza el `token`. */
  getOne (houseId: string): Observable<HouseResponse> {
    return this.http
      .get<InfoHouseResponse>(`${this.baseUrl}/${houseId}`, { headers: { 'set-house': 'true' } })
      .pipe(
        map(response => response.data),
        tap(response => {
          if (response.token) localStorage.setItem('token', response.token);
        })
      );
  }

  /** Obtiene información la casa con id `houseInfoID` para ver y modificar sus datos. */
  getHouseInfo (): Observable<HouseResponse> {
    if (!this.houseID) {
      this.router.navigate(['/dashboard', 'profile']);
      return throwError(() => new Error('No se encontró la casa.'));
    }

    return this.http
      .get<InfoHouseResponse>(`${this.baseUrl}/${this.houseID}`)
      .pipe(map(response => response.data));
  }

  /** Modifica datos de la casa con id `houseInfoID`. */
  modifyHouse (data: ModalDataTransfer): Observable<HouseResponse> {
    if (!this.houseID) return throwError(() => new Error('No se encontró la casa.'));

    const body: UpdateHouseDto = {
      nombre: data.houseName,
      direccion: {
        calle: data.street,
        numero: isNaN(Number(data.number)) ? undefined : Number(data.number),
        ciudad: data.city
      }
    };

    return this.http
      .patch<InfoHouseResponse>(`${this.baseUrl}/name-dir/${this.houseID}`, body)
      .pipe(map(response => response.data));
  }
}
