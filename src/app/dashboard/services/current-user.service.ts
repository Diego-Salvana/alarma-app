import { inject, Injectable, signal } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastService } from '../../shared/services';
import { HouseResponse } from '../../shared/interfaces';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);
  private _username = signal<string | null>(null);
  private _email = signal<string | null>(null);
  private _houses = signal<HouseResponse[]>([]);
  private _isLoading = signal(false);
  username = this._username.asReadonly();
  email = this._email.asReadonly();
  houses = this._houses.asReadonly();
  isLoading = this._isLoading.asReadonly();

  loadUser () {
    this._isLoading.set(true);
    this.profileService
      .getUser()
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
        next: profile => {
          this._username.set(profile.nombreUsuario);
          this._email.set(profile.email);
          this._houses.set(profile.casas);
        },
        error: () => this.toastService.error('Error al obtener los datos del usuario')
      });
  }

  setUserNull () {
    this._username.set(null);
    this._email.set(null);
    this._houses.set([]);
  }
}
