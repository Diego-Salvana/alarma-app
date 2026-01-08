import { effect, inject, Injectable, signal } from '@angular/core';
import { TriggeredAlarm, Warning } from '../interfaces';
import { SocketService } from './web-socket.service';
import { Subscription } from 'rxjs';
import { WS_TRIGGER_ALARM, WS_WARNING } from '../../env';
import { CurrentUserService } from './current-user.service';
import { CurrentHouseService } from './current-house.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private socketService = inject(SocketService);
  private userService = inject(CurrentUserService);
  private currentHouseService = inject(CurrentHouseService);
  private warningSub?: Subscription;
  private triggerSub?: Subscription;
  private _houseWarning = signal<Warning | null>(null);
  private _triggerAlert = signal<TriggeredAlarm | null>(null);
  houseWarning = this._houseWarning.asReadonly();
  triggerAlert = this._triggerAlert.asReadonly();

  constructor () {
    effect(onCleanup => {
      const username = this.userService.username();
      if (!username) return;

      this.initWarningListener(username);
      this.initTriggeredAlarmListenter(username);
  
      onCleanup(() => this.stopListeners());
    });
  }

  initWarningListener (username: string) {
    this.warningSub?.unsubscribe();

    this.warningSub = this.socketService
      .on<Warning>(`${WS_WARNING}/${username}`)
      .subscribe(warning => this._houseWarning.set(warning));
  }

  initTriggeredAlarmListenter (username: string) {
    this.triggerSub?.unsubscribe();

    this.triggerSub = this.socketService
      .on<TriggeredAlarm>(`${WS_TRIGGER_ALARM}/${username}`)
      .subscribe(data => {
        this._triggerAlert.set(data);
        this.currentHouseService.syncRingigState(data);
      });
  }

  stopListeners () {
    this.warningSub?.unsubscribe();
    this._houseWarning.set(null);
    this.triggerSub?.unsubscribe();
    this._triggerAlert.set(null);
  }
}
