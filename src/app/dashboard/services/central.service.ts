import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, CentralEvent, CentralHistoryResponse } from '../../shared/interfaces';
import { map, Observable } from 'rxjs';
import { ENV } from '../../env';
import { mapCentralEventResponseToDomain } from '../../shared/utils';

/** Provee acceso a la API para realizar operaciones relacionadas a la central. */
@Injectable({
  providedIn: 'root'
})
export class CentralService {
  private http = inject(HttpClient);
  private baseUrl = `${ENV.API_URL}/central`;

  /** Obtiene el historial de eventos de la central. */
  getHistory (): Observable<CentralEvent[]> {
    return this.http
      .get<ApiResponse<CentralHistoryResponse>>(`${this.baseUrl}`)
      .pipe(map(({ data }) => mapCentralEventResponseToDomain(data.history)));
  }
}
