import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BtnEditCardComponent } from '../../components/btn-edit-card/btn-edit-card.component';
import { ModalPasswordComponent } from '../../components/modals/modal-password/modal-password.component';
import { ModalProfileComponent } from '../../components/modals/modal-profile/modal-profile.component';
import { ProfileProp } from '../../interfaces/modals.interfaces';

type ModalType = 'password' | 'profile';

@Component({
  selector: 'app-profile',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, RouterLink, ModalPasswordComponent, ModalProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  visiblePassModal = false;
  visibleProfileModal = false;
  profileProp?: ProfileProp;

  showDialog (modal: ModalType, prop?: ProfileProp) {
    switch (modal) {
      case 'password':
        this.visiblePassModal = true;
        break;
      case 'profile':
        this.visibleProfileModal = true;
        break;
      default:
        break;
    }

    switch (prop) {
      case 'name':
        this.profileProp = 'name';
        break;
      case 'lastname':
        this.profileProp = 'lastname';
        break;
      case 'phone':
        this.profileProp = 'phone';
        break;
      default:
        break;
    }
  }
  
  closeDialog () {
    this.visiblePassModal = false;
    this.visibleProfileModal = false;
  }
}
