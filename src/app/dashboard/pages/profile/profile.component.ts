import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BtnEditCardComponent, PasswordModalComponent, ProfileModalComponent } from '../../components';
import { ModalDataTransfer, ProfileProp } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { Estado, ProfileResponse, State } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { CurrentHouseService, HouseService } from '../../services';
import { LogoutModalComponent } from '../../../shared/components';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type ModalType = 'password' | 'profile';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, PasswordModalComponent, ProfileModalComponent, LogoutModalComponent, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private profileService = inject(ProfileService);
  private houseService = inject(HouseService);
  private currentHouseService = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  user = signal<ProfileResponse | null>(null);
  isLoading = signal(true);
  passModalOpen = signal(false);
  profileModalOpen = signal(false);
  logoutModalOpen = signal(false);
  submitted = signal(true);
  profileProp?: ProfileProp;
  propValue = '';
  isAlarmArmed = computed(() => this.currentHouseService.house()?.alarmaEncendida === State.ON);
  
  constructor () {
    this.profileService
      .getUser()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: userResponse => this.user.set(userResponse),
        error: err => this.handleProfileError(err)
      });
  }

  /** Actualiza datos del perfil de usuario. */
  updateProfile (data: ModalDataTransfer) {
    this.submitted.set(false);
        
    this.profileService
      .modifyUserData(data)
      .pipe(
        finalize(() => {
          this.submitted.set(true);
          this.profileModalOpen.set(false);
        })
      )
      .subscribe({
        next: userResponse => this.user.set(userResponse),
        error: e => this.toastService.error(e.error.message)
      });
  }

  /** Cambia la contraseña del usuario. */
  updatePassword (data: ModalDataTransfer) {
    this.submitted.set(false);

    this.profileService
      .updateUserPassword(data)
      .pipe(
        finalize(() => {
          this.submitted.set(true);
          this.passModalOpen.set(false);
        })
      )
      .subscribe({
        error: err => this.toastService.error(err.error.message)
      });
  }

  /** Navega a la información de la casa. */
  goToHouseInfo (id: string) {
    this.houseService.setHouseInfoID(id);
    this.router.navigate(['/dashboard', 'profile', 'house']);
  }

  /** Abre una modal de edición según la propiedad de perfil. */
  showDialog (modal: ModalType, prop?: ProfileProp) {
    const user = this.user();
    if (!user) return;

    switch (modal) {
      case 'password':
        this.passModalOpen.set(true);
        this.profileProp = 'password';
        break;
      case 'profile':
        this.profileModalOpen.set(true);
        break;
    }

    switch (prop) {
      case 'name':
        this.profileProp = 'name';
        this.propValue = user.nombre;
        break;
      case 'lastname':
        this.profileProp = 'lastname';
        this.propValue = user.apellido;
        break;
      case 'phone':
        this.profileProp = 'phone';
        this.propValue = user.telefono;
        break;
    }
  }
  
  /** Cierra modales de edición. */
  closeDialog () {
    this.passModalOpen.set(false);
    this.profileModalOpen.set(false);
  }

  showLogoutModal () {
    this.logoutModalOpen.set(true);
  }

  cancelLogout () {
    this.logoutModalOpen.set(false);
  }

  private handleProfileError (err: HttpErrorResponse) {
    err.status === 401
      ? this.toastService.error('No estás autorizado para ver el perfil')
      : this.toastService.error('Ocurrió un error al obtener el perfil');
  }
}
