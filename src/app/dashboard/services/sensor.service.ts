import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, DeviceResponse, Sensor, SensorNameDTO } from '../../shared/interfaces';
import { ENV } from '../../env';
import { mapDeviceResponseToSensor } from '../../shared/utils';

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
      .get<ApiResponse<DeviceResponse>>(`${this.baseUrl}/${sensorNumber}`)
      .pipe(map(({ data }) => mapDeviceResponseToSensor(data)));
  }

  /** Modifica el nombre de un sensor. */
  modifyName (sensorNumber: number, newName: string): Observable<Sensor> {
    const body: SensorNameDTO = {
      numeroSensor: isNaN(sensorNumber) ? 0 : sensorNumber,
      nombre: newName
    };

    return this.http
      .patch<ApiResponse<DeviceResponse>>(`${this.baseUrl}/sensor-name`, body)
      .pipe(map(({ data }) => mapDeviceResponseToSensor(data)));
  }
}
