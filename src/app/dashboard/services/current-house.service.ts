import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { SensorArmConfigDTO, Estado, HouseResponse, TriggerDTO } from '../../shared/interfaces';
import { HouseService } from './house.service';
import { finalize, Observable } from 'rxjs';
import { StatusRequest, Lights, AlarmArming, TriggeredAlarm } from '../interfaces';
import { API_URL } from '../../env';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../shared/services';
import { AlertService } from './alert.service';

/** Servicio que funciona como controlador para manejar la casa actual. */
@Injectable({
  providedIn: 'root'
})
export class CurrentHouseService {
  private http = inject(HttpClient);
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private baseUrl = `${API_URL}/houses`;
  private _house = signal<HouseResponse | null>(null);
  private _isLoading = signal(false);
  house = this._house.asReadonly();
  isLoading = this._isLoading.asReadonly();

  constructor () {
    effect(() => {
      const armData = this.alertService.armAlert();
      if (armData) this.syncArmingState(armData);
    });

    effect(() => {
      const triggerData = this.alertService.triggerAlert();
      if (triggerData) this.syncRingigState(triggerData);
    });
  }

  loadCurrentHouse () {
    this._isLoading.set(true);

    this.houseService
      .getCurrent()
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
        next: house => this._house.set(house),
        error: err => this.toastService.error(err.error.message)
      });
  }

  loadHouseById (houseId: string) {
    this._isLoading.set(true);

    this.houseService
      .getOne(houseId, true)
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
        next: house => this._house.set(house),
        error: err => this.toastService.error(err.error.message)
      });
  }

  // --------------
  /*    Salida   */
  // --------------

  /** Envía solicitud para `activar` la alarma de la casa almacenada en el token. La respuesta de activación se recibe por `websocket`. */
  armAlarm (sensorsConfig: SensorArmConfigDTO[]): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/arm`, { sensors: sensorsConfig });
  }

  /** Envía solicitud para `desactivar` la alarma de la casa almacenada en el token. La respuesta de desactivación se recibe por `websocket`. */
  disarmAlarm (): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/disarm`, {});
  }

  /** Envía solicitud para `activar/desactivar` la sirena de la alarma actual. */
  toggleRinging (body: TriggerDTO): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/trigger`, body);
  }

  // Luces
  setLights (body: Lights): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/lights`, body);
  }

  // ---------------
  /*    Entrada   */
  // ---------------
  
  /** Actualiza el estado la casa y los sensores con la información recibida por `websocket`. */
  private syncArmingState (info: AlarmArming) {
    const currentHouse = untracked(() => this._house());
    if (currentHouse?.nombreCasa !== info.house) return;

    this._house.update(house => {
      if (!house) return null;
      
      return {
        ...house,
        alarmaEncendida: info.state,
        sensores: house.sensores.map(sensor => ({
          ...sensor,
          estado: info.excludedSensors.includes(sensor.numeroSensor.toString())
            ? Estado.APAGADO
            : Estado.ENCENDIDO
        }))
      };
    });
  }

  /** Sincroniza el estado de la sirena si la alerta proviene de la casa actual. */
  syncRingigState (info: TriggeredAlarm) {
    const currentHouse = untracked(() => this._house());
    if (currentHouse?.nombreCasa !== info.house) return;
  
    this._house.update(house => !house ? null : { ...house, sonando: info.ringing });
  }
}
