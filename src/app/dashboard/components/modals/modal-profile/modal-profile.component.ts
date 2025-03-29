import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ProfileProp } from '../../../interfaces/modals.interfaces';

@Component({
  selector: 'app-modal-profile',
  imports: [DialogModule, ButtonModule, InputTextModule, PasswordModule, InputMaskModule],
  templateUrl: './modal-profile.component.html',
  styleUrl: './modal-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalProfileComponent {
  visible = model<boolean>(false);
  profileProp = input<ProfileProp>();

  close () {
    this.visible.set(false);
  }
}
