import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BtnEditCardComponent, ModalPasswordComponent, ModalProfileComponent } from '../../components';
import { ModalDataTransfer, ProfileProp } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { Estado, ProfileResponse } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { CurrentHouseService, HouseService } from '../../services';
import { ModalLogoutComponent } from '../../../shared/components';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

type ModalType = 'password' | 'profile';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, ModalPasswordComponent, ModalProfileComponent, ModalLogoutComponent, NgClass],
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
  loading = signal(true);
  user = signal<ProfileResponse | null>(null);
  submitCompleted = signal(true);
  passModalOpen = signal(false);
  profileModalOpen = signal(false);
  logoutModalOpen = signal(false);
  profileProp?: ProfileProp;
  propValue?: string;
  isAlarmOn = computed(() =>
    this.currentHouseService.house()?.alarmaEncendida === Estado.ENCENDIDO
  );
  
  constructor () {
    this.profileService.getUser()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: userResponse => this.user.set(userResponse),
        error: e => this.toastService.error(e.error.message)
      });
  }

  /** Actualiza datos del perfil de usuario. */
  updateProfile (data: ModalDataTransfer) {
    this.submitCompleted.set(false);
        
    this.profileService.modifyUserData(data)
      .pipe(
        finalize(() => {
          this.submitCompleted.set(true);
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
    this.submitCompleted.set(false);

    this.profileService.updateUserPassword(data)
      .pipe(
        finalize(() => {
          this.submitCompleted.set(true);
          this.passModalOpen.set(false);
        })
      )
      .subscribe({
        error: e => this.toastService.error(e.error.message)
      });
  }

  /** Navega a la información de la casa. */
  goToHouseInfo (id: string) {
    this.houseService.setHouseInfoID(id);
    this.router.navigate(['/dashboard', 'profile', 'house']);
  }

  /** Abre una modal de edición según la propiedad de perfil. */
  showDialog (modal: ModalType, prop?: ProfileProp) {
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
        this.propValue = this.user()?.nombre;
        break;
      case 'lastname':
        this.profileProp = 'lastname';
        this.propValue = this.user()?.apellido;
        break;
      case 'phone':
        this.profileProp = 'phone';
        this.propValue = this.user()?.telefono;
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
}
