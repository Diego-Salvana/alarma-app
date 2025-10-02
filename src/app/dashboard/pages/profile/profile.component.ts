import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
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

type ModalType = 'password' | 'profile';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, ModalPasswordComponent, ModalProfileComponent, ModalLogoutComponent, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);
  private houseService = inject(HouseService);
  private currentHouseService = inject(CurrentHouseService);
  private router = inject(Router);
  loading = signal(true);
  user = signal<ProfileResponse | null>(null);
  submitCompleted = signal(true);
  visiblePassModal = signal(false);
  visibleProfileModal = signal(false);
  showModalLogout = signal(false);
  profileProp?: ProfileProp;
  propValue?: string;
  isAlarmOn = computed(() =>
    this.currentHouseService.house()?.alarmaEncendida === Estado.ENCENDIDO
  );
  
  ngOnInit () {
    this.profileService.getUser().subscribe({
      next: userResponse => {
        this.user.set(userResponse);
        this.loading.set(false);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.loading.set(false);
      }
    });
  }

  onSubmit (data: ModalDataTransfer) {
    this.submitCompleted.set(false);
        
    this.profileService.modifyUserData(data).subscribe({
      next: userResponse => {
        this.user.set(userResponse);
        this.submitCompleted.set(true);
        this.visibleProfileModal.set(false);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitCompleted.set(true);
        this.visibleProfileModal.set(false);
      }
    });
  }

  onChangePassword (data: ModalDataTransfer) {
    this.submitCompleted.set(false);

    this.profileService.updateUserPassword(data).subscribe({
      next: () => {
        this.submitCompleted.set(true);
        this.visiblePassModal.set(false);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitCompleted.set(true);
        this.visiblePassModal.set(false);
      }
    });
  }

  goInfoHouse (id: string) {
    this.houseService.setHouseInfoID(id);
    this.router.navigate(['/dashboard', 'profile', 'house']);
  }

  showDialog (modal: ModalType, prop?: ProfileProp) {
    switch (modal) {
      case 'password':
        this.visiblePassModal.set(true);
        this.profileProp = 'password';
        break;
      case 'profile':
        this.visibleProfileModal.set(true);
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
  
  closeDialog () {
    this.visiblePassModal.set(false);
    this.visibleProfileModal.set(false);
  }

  logout () {
    this.showModalLogout.set(true);
  }

  cancelLogout () {
    this.showModalLogout.set(false);
  }
}
