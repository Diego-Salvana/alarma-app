import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [DialogModule, ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class ConfirmDialogComponent {
  visible = input.required<boolean>();
  submitted = input.required<boolean>();
  title = input.required<string>();
  description = input.required<string>();
  acceptLabel = input.required<string>();
  onCloseDialog = output<boolean>();

  onAccept () {
    this.onCloseDialog.emit(true);
  }

  onReject () {
    this.onCloseDialog.emit(false);
  }
}
