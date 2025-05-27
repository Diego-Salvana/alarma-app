import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BtnEditCardComponent, ModalPasswordComponent, ModalProfileComponent } from '../../components';
import { ModalDataTransfer, ProfileProp } from '../../interfaces/modals.interfaces';
import { ProfileService } from '../../services/profile.service';
import { ProfileResponse } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { HouseService } from '../../services';
import { ModalLogoutComponent } from '../../../shared/components';

type ModalType = 'password' | 'profile';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, ModalPasswordComponent, ModalProfileComponent, ModalLogoutComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);
  private houseService = inject(HouseService);
  private router = inject(Router);
  user = signal<ProfileResponse | null>(null);
  noUser = signal(false);
  submitEnd = signal(true);
  visiblePassModal = false;
  visibleProfileModal = false;
  profileProp?: ProfileProp;
  propValue?: string;
  showModalLogout = signal(false);
  
  ngOnInit () {
    this.profileService.getUser().subscribe({
      next: userResponse => {
        this.user.set(userResponse);
      },
      error: e => {
        this.toastService.error(e.error.message);
      }
    });
  }

  onSubmit (data: ModalDataTransfer) {
    this.submitEnd.set(false);
        
    this.profileService.modifyUserData(data).subscribe({
      next: userResponse => {
        this.user.set(userResponse);
        this.submitEnd.set(true);
        this.visibleProfileModal = false;
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitEnd.set(true);
        this.visibleProfileModal = false;
      }
    });
  }

  onChangePassword (data: ModalDataTransfer) {
    this.submitEnd.set(false);

    this.profileService.updateUserPassword(data).subscribe({
      next: () => {
        this.submitEnd.set(true);
        this.visiblePassModal = false;
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitEnd.set(true);
        this.visiblePassModal = false;
      }
    });
  }

  goInfoHouse (id: string) {
    this.houseService.infoHouseID = id;
    this.router.navigate(['/dashboard', 'profile', 'house']);
  }

  showDialog (modal: ModalType, prop?: ProfileProp) {
    switch (modal) {
      case 'password':
        this.visiblePassModal = true;
        this.profileProp = 'password';
        break;
      case 'profile':
        this.visibleProfileModal = true;
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
    this.visiblePassModal = false;
    this.visibleProfileModal = false;
  }

  logout () {
    this.showModalLogout.set(true);
  }

  cancelLogout () {
    this.showModalLogout.set(false);
  }
}
