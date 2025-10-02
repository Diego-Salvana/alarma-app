import { inject, Injectable, signal } from '@angular/core';
import { AlarmActivation, Estado, HouseResponse, Sensor } from '../../shared/interfaces';
import { HouseService } from './house.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ActivationResponse, ExclusionSensor } from '../interfaces';
import { cloneDeep } from 'lodash';
import { SensorService } from './sensor.service';

/** Servicio que funciona como controlador para manejar la casa actual. */
@Injectable({
  providedIn: 'root'
})
export class CurrentHouseService {
  private houseService = inject(HouseService);
  private sensorService = inject(SensorService);
  private houseId = '';
  private _house = signal<HouseResponse | null>(null);
  private _loading = signal(false);
  house = this._house.asReadonly();
  loading = this._loading.asReadonly();
  
  setHouseId (houseId: string) {
    this.houseId = houseId;
  }
  
  /** Obtiene la casa actual. Si no existe `houseId` se obtiene del token. */
  getHouse (): Observable<HouseResponse> {
    this._loading.set(true);

    if (!this.houseId) {
      const token = localStorage.getItem('token') ?? '';
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.houseId = payload.hid;
      } catch (e) {
        this._loading.set(false);
        return throwError(() => new Error('Token no válido.'));
      }
    }

    return this.houseService.getHouse(this.houseId)
      .pipe(
        tap(house => {
          this._house.set(house);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          return throwError(() => err);
        })
      );
  }

  /** Inicia activación de la alarma. */
  armAlarm (exclusionArray: ExclusionSensor[]): Observable<ActivationResponse> {
    return this.houseService.armAlarm(exclusionArray);
  }

  /** Inicia desactivación de la alarma. */
  disarmAlarm (): Observable<ActivationResponse> {
    return this.houseService.disarmAlarm();
  }

  /** Actualiza el estado la casa y los sensores con la información recibida por `websocket`. */
  updateHouse (info: AlarmActivation) {
    const updatedHouse = cloneDeep(this._house());
  
    if (!updatedHouse) {
      throw new Error('No se pudo actualizar la casa.');
    }
  
    updatedHouse.alarmaEncendida = info.state;
    updatedHouse.sensores?.forEach((sensor, index) => {
      if (!updatedHouse.sensores) return;
  
      if (info.excludedSensors.includes(sensor.numeroSensor.toString())) {
        updatedHouse.sensores[index].estado = Estado.APAGADO;
      } else {
        updatedHouse.sensores[index].estado = Estado.ENCENDIDO;
      }
    });
  
    this._house.set(updatedHouse);
  }

  // Sensores
  /** Obtiene un sensor de la casa actual por su número. */
  getOneSensor (sensorNumber: string): Observable<Sensor> {
    return this.sensorService.getOne(sensorNumber);
  }

  /** Modifica el nombre de un sensor de la casa actual. */
  modifySensorName (sensorNumber: number, newName: string): Observable<Sensor> {
    return this.sensorService.modifyName(sensorNumber, newName);
  }
}
