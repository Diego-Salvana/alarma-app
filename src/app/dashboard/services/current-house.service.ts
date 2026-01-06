import { effect, inject, Injectable, signal } from '@angular/core';
import { Estado, HouseResponse } from '../../shared/interfaces';
import { HouseService } from './house.service';
import { finalize, Observable, Subscription } from 'rxjs';
import { StatusRequest, ExclusionSensor, Lights, AlarmArming, Trigger, TriggeredAlarm } from '../interfaces';
import { API_URL, WS_ALARM_ARMING } from '../../env';
import { HttpClient } from '@angular/common/http';
import { SocketService, ToastService } from '../../shared/services';
import { CurrentUserService } from './current-user.service';

/** Servicio que funciona como controlador para manejar la casa actual. */
@Injectable({
  providedIn: 'root'
})
export class CurrentHouseService {
  private http = inject(HttpClient);
  private userService = inject(CurrentUserService);
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  private socketService = inject(SocketService);
  private baseUrl = `${API_URL}/houses`;
  private houseId = '';
  private armingSub?: Subscription;
  private _house = signal<HouseResponse | null>(null);
  private _isLoading = signal(false);
  house = this._house.asReadonly();
  isLoading = this._isLoading.asReadonly();

  constructor () {
    effect(onCleanup => {
      const username = this.userService.username();
      const houseName = this._house()?.nombreCasa;
      if (!username || !houseName) {
        this._house.set(null);
        return;
      }

      this.initArmingListenter(username, houseName);
      
      onCleanup(() => this.stopListeners());
    });
  }

  setHouseId (houseId: string) {
    this.houseId = houseId;
  }
  
  /** Obtiene la casa actual. Si no existe `houseId` se obtiene del token. */
  getHouse () {
    this._isLoading.set(true);

    if (!this.houseId) {
      const token = localStorage.getItem('token') ?? '';
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.houseId = payload.hid;
      } catch (e) {
        this._isLoading.set(false);
        this.toastService.error('Token no válido.');
        return;
      }
    }

    return this.houseService
      .getOne(this.houseId)
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
        next: house => this._house.set(house),
        error: err => this.toastService.error(err.message)
      });
  }

  // --- Salida ---
  /** Envía solicitud para `activar` la alarma de la casa almacenada en el token. La respuesta de activación se recibe por `websocket`. */
  armAlarm (exclusionArray: ExclusionSensor[]): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/arm`, { exclusionArray });
  }

  /** Envía solicitud para `desactivar` la alarma de la casa almacenada en el token. La respuesta de desactivación se recibe por `websocket`. */
  disarmAlarm (): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/disarm`, {});
  }

  /** Envía solicitud para `activar/desactivar` la sirena de la alarma actual. */
  toggleRinging (body: Trigger): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/trigger`, body);
  }

  // Luces
  setLights (body: Lights): Observable<StatusRequest> {
    return this.http.post<StatusRequest>(`${this.baseUrl}/lights`, body);
  }

  // --- Entrada ---
  /** Actualiza el estado la casa y los sensores con la información recibida por `websocket`. */
  private updateArmingState (info: AlarmArming) {
    this._house.update(house => {
      if (!house) return house;
      
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
    const house = this._house();
    if (house?.nombreCasa !== info.house) return;

    this._house.update(house => {
      if (!house) return house;
      
      return {
        ...house,
        sonando: info.state === Estado.ENCENDIDO
      };
    });
  }

  private initArmingListenter (username: string, houseName: string) {
    this.armingSub?.unsubscribe();

    this.armingSub = this.socketService
      .on<AlarmArming>(`${WS_ALARM_ARMING}/${username}/${houseName}`)
      .subscribe(data => this.updateArmingState(data));
  }

  private stopListeners () {
    this.armingSub?.unsubscribe();
  }
}
