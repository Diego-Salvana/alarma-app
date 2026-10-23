import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse, Sensor, SensorNameDTO, SensorResponse } from '../../shared/interfaces';
import { ENV } from '../../env';
import { mapSensorResponseToDomain } from '../../shared/utils';

/** Provee acceso a la API para realizar operaciones relacionadas a los sensores. */
@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private http = inject(HttpClient);
  private baseUrl = `${ENV.API_URL}/sensors`;

  /** Obtiene un sensor por su número. */
  getOne (sensorNumber: string): Observable<Sensor> {
    return this.http
      .get<ApiResponse<SensorResponse>>(`${this.baseUrl}/${sensorNumber}`)
      .pipe(map(({ data }) => mapSensorResponseToDomain(data)));
  }

  /** Modifica el nombre de un sensor. */
  modifyName (sensorNumber: number, newName: string): Observable<Sensor> {
    const body: SensorNameDTO = {
      number: isNaN(sensorNumber) ? 0 : sensorNumber,
      name: newName
    };

    return this.http
      .patch<ApiResponse<SensorResponse>>(`${this.baseUrl}/sensor-name`, body)
      .pipe(map(({ data }) => mapSensorResponseToDomain(data)));
  }
}
