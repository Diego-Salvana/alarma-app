import { inject, Injectable } from '@angular/core';
import { HouseResponse } from '../../shared/interfaces';
import { HouseService } from './house.service';
import { Observable, throwError } from 'rxjs';
import { ActivationResponse, ExclusionSensor } from '../interfaces';

// Servicio que funciona como controlador para manejar la casa actual.
@Injectable({
  providedIn: 'root'
})
export class CurrentHouseService {
  private houseService = inject(HouseService);
  private houseId = '';
  
  setHouseId (houseId: string) {
    this.houseId = houseId;
  }
  
  /** Obtiene la casa actual. Si no existe `houseId` se obtiene del token. */
  getHouse (): Observable<HouseResponse> {
    if (!this.houseId) {
      const token = localStorage.getItem('token') ?? '';
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.houseId = payload.hid;
      } catch (e) {
        return throwError(() => new Error('Token no válido.'));
      }
    }

    return this.houseService.getHouse(this.houseId);
  }

  /** Inicia activación de la alarma. */
  armAlarm (exclusionArray: ExclusionSensor[]): Observable<ActivationResponse> {
    return this.houseService.armAlarm(exclusionArray);
  }

  /** Inicia desactivación de la alarma. */
  disarmAlarm (): Observable<ActivationResponse> {
    return this.houseService.disarmAlarm();
  }

  // Sensores
}
