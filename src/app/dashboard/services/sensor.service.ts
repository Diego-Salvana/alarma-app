import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InfoSensorResponse } from '../../auth/interfaces';
import { map, Observable } from 'rxjs';
import { Sensor } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private baseUrl = 'http://localhost:5000/api/sensors';
  private http = inject(HttpClient);

  getOne (sensorNumber: string): Observable<Sensor> {
    return this.http.get<InfoSensorResponse>(`${this.baseUrl}/${sensorNumber}`).pipe(map(res => res.data));
  }
}
