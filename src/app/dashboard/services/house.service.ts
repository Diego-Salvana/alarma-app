import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap, throwError } from 'rxjs';

import { HouseResponse, HouseUpdate, NewCode, AlarmCodeUpdateDTO, HouseUpdateDTO, AddressResponse, House, ApiResponse } from '../../shared/interfaces';
import { ENV } from '../../env';
import { mapHouseResponseToDomain } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${ENV.API_URL}/houses`;
  private houseID: string | null = null; // Id de una casa para ver y modificar sus datos.

  setHouseInfoID (id: string) {
    this.houseID = id;
  }

  /** Obtiene información de la casa que será utilizada como `currentHouse` y actualiza el `token`. */
  getOne (houseId: string, setCurrent = false): Observable<House> {
    const headers = setCurrent ? new HttpHeaders({ 'set-house': 'true' }) : undefined;

    return this.http
      .get<ApiResponse<HouseResponse>>(`${this.baseUrl}/${houseId}`, headers ? { headers } : {})
      .pipe(
        tap(({ data }) => {
          if (data.token) localStorage.setItem('token', data.token);
        }),
        map(({ data }) => mapHouseResponseToDomain(data))
      );
  }

  /** Obtiene la casa actual del usuario (a través del token) desde la API y devuelve su data. */
  getCurrent (): Observable<House> {
    return this.http
      .get<ApiResponse<HouseResponse>>(`${this.baseUrl}/current`)
      .pipe(map(({ data }) => mapHouseResponseToDomain(data)));
  }

  /** Obtiene información la casa con id `houseInfoID` para ver y modificar sus datos. */
  getHouseInfo (): Observable<House> {
    if (!this.houseID) {
      this.router.navigate(['/dashboard', 'profile']);
      return throwError(() => new Error('No se encontró la casa.'));
    }

    return this.http
      .get<ApiResponse<HouseResponse>>(`${this.baseUrl}/${this.houseID}`)
      .pipe(map(({ data }) => mapHouseResponseToDomain(data)));
  }

  /** Modifica código de activación de la casa con id `houseInfoID`. */
  updateAlarmCode (data: NewCode): Observable<ApiResponse<null>> {
    if (!this.houseID) return throwError(() => new Error('No se encontró la casa.'));

    const { password, currentCode, newCode } = data;
    const dto: AlarmCodeUpdateDTO = { password, currentCode, newCode };

    return this.http.patch<ApiResponse<null>>(`${ENV.API_URL}/central/code/${this.houseID}`, dto);
  }

  updateHouseInfo (data: HouseUpdate): Observable<House> {
    if (!this.houseID) return throwError(() => new Error('No se encontró la casa.'));

    const address: Partial<AddressResponse> = {
      ...(data.addressStreet && { street: data.addressStreet }),
      ...(data.addressNumber && { number: data.addressNumber }),
      ...(data.city && { city: data.city })
    };

    const body: HouseUpdateDTO = {
      ...(data.houseName && { name: data.houseName }),
      ...(Object.keys(address).length && { address })
    };

    return this.http
      .patch<ApiResponse<HouseResponse>>(`${this.baseUrl}/name-dir/${this.houseID}`, body)
      .pipe(map(({ data }) => mapHouseResponseToDomain(data)));
  }
}
