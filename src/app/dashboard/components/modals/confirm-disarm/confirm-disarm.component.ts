import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirm-disarm',
  imports: [DialogModule, ButtonModule],
  templateUrl: './confirm-disarm.component.html',
  styleUrl: './confirm-disarm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class ConfirmDisarmComponent {
  visible = input.required<boolean>();
  submitEnd = input.required<boolean>();
  onCloseDialog = output<boolean>();

  onAccept () {
    this.onCloseDialog.emit(true);
  }

  onReject () {
    this.onCloseDialog.emit(false);
  }
}
