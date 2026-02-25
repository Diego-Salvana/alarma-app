import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SecurityCardComponent } from '../../components';
import { ProfileService } from '../../services/profile.service';
import { ProfileResponse, State, NewPassword, ProfileUpdate } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { CurrentHouseService, HouseService } from '../../services';
import { LogoutModalComponent } from '../../../shared/components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DetailsCardComponent } from '../../components/details-card/details-card.component';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, LogoutModalComponent, SecurityCardComponent, DetailsCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private houseService = inject(HouseService);
  private currentHouseService = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  user = signal<ProfileResponse | null>(null);
  isLoading = signal(true);
  logoutModalOpen = signal(false);
  submitted = signal(true);
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
  updateProfile (data: ProfileUpdate) {
    this.submitted.set(false);
        
    this.profileService
      .modifyUserData(data)
      .pipe(finalize(() => this.submitted.set(true)))
      .subscribe({
        next: userResponse => this.user.set(userResponse),
        error: err => this.toastService.error(err.error.message)
      });
  }

  /** Cambia la contraseña del usuario. */
  updatePassword (data: NewPassword) {
    this.submitted.set(false);

    this.profileService
      .updateUserPassword(data)
      .pipe(finalize(() => this.submitted.set(true)))
      .subscribe({
        next: _ => this.toastService.info('Contraseña actualizada correctamente'),
        error: err => this.toastService.error(err.error.message)
      });
  }

  /** Navega a la información de la casa. */
  goToHouseInfo (id: string) {
    this.houseService.setHouseInfoID(id);
    this.router.navigate(['/dashboard', 'profile', 'house']);
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
