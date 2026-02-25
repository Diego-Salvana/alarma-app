import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap, throwError } from 'rxjs';
import { HouseResponse, HouseUpdate, InfoHouseResponse, InfoHousesResponse, NewCode, AlarmCodeUpdateDTO, HouseUpdateDTO, AddressResponse } from '../../shared/interfaces';
import { API_URL } from '../../env';
import { HttpHeaders } from '@capacitor/core';

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
  getOne (houseId: string, setCurrent = false): Observable<HouseResponse> {
    const headers: HttpHeaders = { 'set-house': setCurrent.toString() };
    
    return this.http
      .get<InfoHouseResponse>(`${this.baseUrl}/${houseId}`, { headers })
      .pipe(
        map(response => response.data),
        tap(response => {
          if (response.token) localStorage.setItem('token', response.token);
        })
      );
  }

  /** Obtiene la casa actual del usuario (a través del token) desde la API y devuelve su data. */
  getCurrent (): Observable<HouseResponse> {
    return this.http
      .get<InfoHouseResponse>(`${this.baseUrl}/current`)
      .pipe(map(response => response.data));
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

  /** Modifica código de activación de la casa con id `houseInfoID`. */
  updateAlarmCode (data: NewCode): Observable<void> {
    if (!this.houseID) return throwError(() => new Error('No se encontró la casa.'));

    const { password, currentCode, newCode } = data;
    const currentCodeNumber = parseInt(currentCode);
    const newCodeNumber = parseInt(newCode);

    const info: AlarmCodeUpdateDTO = {
      contrasena: password,
      codigoActual: currentCodeNumber,
      nuevoCodigo: newCodeNumber
    };

    return this.http.patch<void>(`${API_URL}/central/code/${this.houseID}`, info);
  }

  updateHouseInfo (data: HouseUpdate): Observable<HouseResponse> {
    if (!this.houseID) return throwError(() => new Error('No se encontró la casa.'));

    const address: Partial<AddressResponse> = {
      ...(data.addressStreet && { calle: data.addressStreet }),
      ...(data.addressNumber && { numero: data.addressNumber }),
      ...(data.city && { ciudad: data.city })
    };

    const body: HouseUpdateDTO = {
      ...(data.houseName && { nombre: data.houseName }),
      ...(Object.keys(address).length && { direccion: address })
    };

    return this.http
      .patch<InfoHouseResponse>(`${this.baseUrl}/name-dir/${this.houseID}`, body)
      .pipe(map(response => response.data));
  }
}
