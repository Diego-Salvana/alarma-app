import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HouseResponse, InfoHouseResponse } from '../../auth/interfaces';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private baseUrl = 'http://localhost:5000/api/houses';
  private http = inject(HttpClient);
  currentHouse = '';

  getAll (): Observable<HouseResponse[]> {
    return this.http.get<InfoHouseResponse>(`${this.baseUrl}/`).pipe(map(response => response.data));
  }
}
