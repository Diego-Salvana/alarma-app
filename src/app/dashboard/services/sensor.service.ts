import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InfoSensorResponse, Sensor } from '../../shared/interfaces';
import { API_URL } from '../../env';

/** Provee acceso a la API para realizar operaciones relacionadas a los sensores. */
@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/sensors`;

  /** Obtiene un sensor por su número. */
  getOne (sensorNumber: string): Observable<Sensor> {
    return this.http
      .get<InfoSensorResponse>(`${this.baseUrl}/${sensorNumber}`)
      .pipe(map(res => res.data));
  }

  /** Modifica el nombre de un sensor. */
  modifyName (sensorNumber: number, newName: string): Observable<Sensor> {
    const body: Pick<Sensor, 'nombre' | 'numeroSensor'> = {
      nombre: newName,
      numeroSensor: isNaN(sensorNumber) ? 0 : sensorNumber
    };

    return this.http
      .patch<InfoSensorResponse>(`${this.baseUrl}/sensor-name`, body)
      .pipe(map(res => res.data));
  }
}
