import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap, throwError } from 'rxjs';
import { Casa, HouseResponse, InfoHouseResponse, InfoHousesResponse } from '../../shared/interfaces';
import { ExclusionSensor, ModalDataTransfer } from '../interfaces';

interface UpdateHouseBody {
  nombre?: Casa ['nombre'];
  direccion?: Partial<Casa ['direccion']>;
}

type RequestState = 'success' | 'pending' | 'error';

interface ActivationResponse {
  message: string;
  state: RequestState;
}

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private baseUrl = 'http://localhost:5000/api/houses';
  private http = inject(HttpClient);
  private router = inject(Router);
  currentHouse = '';
  infoHouseID = '';

  getAll (): Observable<HouseResponse[]> {
    return this.http.get<InfoHousesResponse>(`${this.baseUrl}`).pipe(map(response => response.data));
  }

  /** Obtiene información de una casa. Si `setHouse` es true actualiza casa actual y el token. */
  getHouse (setHouse = false): Observable<HouseResponse> {
    let houseId: string;

    if (this.currentHouse) {
      houseId = this.currentHouse;
    } else {
      const token = localStorage.getItem('token') ?? '';

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        houseId = payload.hid;
      } catch (e) {
        return throwError(() => new Error('Token no válido.'));
      }
    }

    return this.http.get<InfoHouseResponse>(
      `${this.baseUrl}/${houseId}`, { headers: { 'set-house': setHouse ? 'true' : 'false' } }
    ).pipe(
      map(response => response.data),
      tap(response => {
        if (response.token) localStorage.setItem('token', response.token);
      })
    );
  }

  getInfoHouse (): Observable<HouseResponse> {
    if (!this.infoHouseID) {
      this.router.navigate(['/dashboard', 'profile']);
      return throwError(() => new Error('No se encontró la casa.'));
    }

    return this.http.get<InfoHouseResponse>(`${this.baseUrl}/${this.infoHouseID}`)
      .pipe(map(response => response.data));
  }

  modifyHouse (data: ModalDataTransfer): Observable<HouseResponse> {
    const body: UpdateHouseBody = {
      nombre: data.houseName,
      direccion: {
        calle: data.street,
        numero: isNaN(Number(data.number)) ? undefined : Number(data.number),
        ciudad: data.city
      }
    };

    return this.http.patch<InfoHouseResponse>(`${this.baseUrl}/name-dir/${this.infoHouseID}`, body)
      .pipe(map(response => response.data));
  }

  activeAlarm (exclusionArray: ExclusionSensor[]): Observable<ActivationResponse> {
    return this.http.post<ActivationResponse>(`${this.baseUrl}/active`, { exclusionArray });
  }

  disarmAlarm (): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.baseUrl}/disarm`);
  }
}
