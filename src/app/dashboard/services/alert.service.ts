import { inject, Injectable, signal } from '@angular/core';
import { AlarmArming, TriggeredAlarm, Warning } from '../interfaces';
import { SocketService } from './web-socket.service';
import { Subscription } from 'rxjs';
import { WS_ALARM_ARMING, WS_TRIGGER_ALARM, WS_WARNING } from '../../shared/constants';

/** Servicio que gestiona notificaciones en tiempo real para alarmas, usando WebSocket y estados reactivos. */
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private socketService = inject(SocketService);
  private warningSub?: Subscription;
  private triggerSub?: Subscription;
  private armingSub?: Subscription;
  private _houseWarning = signal<Warning | null>(null);
  private _triggerAlert = signal<TriggeredAlarm | null>(null);
  private _armAlert = signal<AlarmArming | null>(null);
  houseWarning = this._houseWarning.asReadonly();
  triggerAlert = this._triggerAlert.asReadonly();
  armAlert = this._armAlert.asReadonly();

  initListeners (username: string) {
    this.initWarningListener(username);
    this.initTriggeredAlarmListenter(username);
    this.initArmingListenter(username);
  }
  
  stopListeners () {
    this.warningSub?.unsubscribe();
    this._houseWarning.set(null);
    this.triggerSub?.unsubscribe();
    this._triggerAlert.set(null);
    this.armingSub?.unsubscribe();
    this._armAlert.set(null);
  }
  
  private initWarningListener (username: string) {
    this.warningSub?.unsubscribe();

    this.warningSub = this.socketService
      .on<Warning>(`${WS_WARNING}/${username}`)
      .subscribe(warning => this._houseWarning.set(warning));
  }

  private initTriggeredAlarmListenter (username: string) {
    this.triggerSub?.unsubscribe();

    this.triggerSub = this.socketService
      .on<TriggeredAlarm>(`${WS_TRIGGER_ALARM}/${username}`)
      .subscribe(triggerData => this._triggerAlert.set(triggerData));
  }

  private initArmingListenter (username: string) {
    this.armingSub?.unsubscribe();
  
    this.armingSub = this.socketService
      .on<AlarmArming>(`${WS_ALARM_ARMING}/${username}`)
      .subscribe(armData => this._armAlert.set(armData));
  }
}
