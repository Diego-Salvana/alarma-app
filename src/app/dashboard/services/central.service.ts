import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HistorialConNombre, InfoHistoryResponse } from '../../shared/interfaces';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentralService {
  private baseUrl = 'http://localhost:5000/api/central';
  private http = inject(HttpClient);

  getHistory (): Observable<HistorialConNombre[]> {
    return this.http.get<InfoHistoryResponse>(`${this.baseUrl}`).pipe(map(response => response.data));
  }
}
