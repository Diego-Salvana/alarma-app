import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HistorialConNombre, InfoHistoryResponse } from '../../shared/interfaces';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../env';

/** Provee acceso a la API para realizar operaciones relacionadas a la central. */
@Injectable({
  providedIn: 'root'
})
export class CentralService {
  private baseUrl = `${API_URL}/central`;
  private http = inject(HttpClient);

  /** Obtiene el historial de eventos de la central. */
  getHistory (): Observable<HistorialConNombre[]> {
    return this.http.get<InfoHistoryResponse>(`${this.baseUrl}`)
      .pipe(map(response => response.data));
  }
}
