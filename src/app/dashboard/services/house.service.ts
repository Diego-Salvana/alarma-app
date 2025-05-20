import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HouseResponse, InfoHouseResponse, InfoHousesResponse } from '../../auth/interfaces';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private baseUrl = 'http://localhost:5000/api/houses';
  private http = inject(HttpClient);
  currentHouse = '';

  getAll (): Observable<HouseResponse[]> {
    return this.http.get<InfoHousesResponse>(`${this.baseUrl}`).pipe(map(response => response.data));
  }

  getHouse (): Observable<HouseResponse> {
    let houseId: string;

    if (this.currentHouse) {
      houseId = this.currentHouse;
    } else {
      const token = localStorage.getItem('token') ?? '';

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        houseId = payload.hid;
      } catch (e) {
        throw new Error('Token no válido.');
      }
    }

    return this.http.get<InfoHouseResponse>(`${this.baseUrl}/${houseId}`).pipe(map(response => response.data));
  }
}
