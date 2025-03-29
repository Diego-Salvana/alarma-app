import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-modal-password',
  imports: [DialogModule, ButtonModule, PasswordModule],
  templateUrl: './modal-password.component.html',
  styleUrl: './modal-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalPasswordComponent {
  visible = model<boolean>(false);

  close () {
    this.visible.set(false);
  }
}
