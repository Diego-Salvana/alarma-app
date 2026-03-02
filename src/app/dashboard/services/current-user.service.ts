import { effect, inject, Injectable, signal } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastService } from '../../shared/services';
import { House, State } from '../../shared/interfaces';
import { finalize } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private profileService = inject(ProfileService);
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);
  private _username = signal<string | null>(null);
  private _email = signal<string | null>(null);
  private _houses = signal<House[]>([]);
  private _isLoading = signal(false);
  username = this._username.asReadonly();
  email = this._email.asReadonly();
  houses = this._houses.asReadonly();
  isLoading = this._isLoading.asReadonly();

  constructor () {
    effect(() => {
      const armAlert = this.alertService.armAlert();
      if (armAlert) {
        this.updateHousesState(armAlert.house, { state: armAlert.state });
      }
    });

    effect(() => {
      const triggerAlert = this.alertService.triggerAlert();
      if (triggerAlert) {
        this.updateHousesState(triggerAlert.house, { ringing: triggerAlert.ringing });
      }
    });
  }

  loadUser () {
    this._isLoading.set(true);
    this.profileService
      .getUser()
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
        next: profile => {
          this._username.set(profile.username);
          this._email.set(profile.email);
          this._houses.set(profile.houses);
        },
        error: () => this.toastService.error('Error al obtener los datos del usuario')
      });
  }

  logout () {
    this._username.set(null);
    this._email.set(null);
    this._houses.set([]);
    localStorage.removeItem('token');
  }

  /** Acutaliza la signal cuando el usuario cambia la info de la Casa */
  syncHouseInfo (house: House) {
    this._houses.update(houses => houses.map(h => h.id === house.id ? house : h));
  }

  private updateHousesState (houseName: string, info: { state?: State, ringing?: boolean }) {
    this._houses.update(houses => houses.map(house => {
      if (house.houseName !== houseName) return house;
        
      return {
        ...house,
        alarmState: info.state ?? house.alarmState,
        isRinging: info.ringing ?? house.isRinging
      };
    }));
  }
}
