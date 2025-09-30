import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InfoSensorResponse, Sensor } from '../../shared/interfaces';
import { API_URL } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private baseUrl = `${API_URL}/sensors`;
  private http = inject(HttpClient);

  getOne (sensorNumber: string): Observable<Sensor> {
    return this.http.get<InfoSensorResponse>(`${this.baseUrl}/${sensorNumber}`).pipe(map(res => res.data));
  }

  modifyName (sensorNumber: number, newName: string): Observable<Sensor> {
    const body: Pick<Sensor, 'nombre' | 'numeroSensor'> = {
      nombre: newName,
      numeroSensor: isNaN(sensorNumber) ? 0 : sensorNumber
    };

    return this.http.patch<InfoSensorResponse>(`${this.baseUrl}/sensor-name`, body).pipe(map(res => res.data));
  }
}
