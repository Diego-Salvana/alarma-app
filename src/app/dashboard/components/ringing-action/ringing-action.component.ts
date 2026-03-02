import { ChangeDetectionStrategy, Component, signal, input, output, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogComponent } from '../modals';

@Component({
  selector: 'app-ringing-action',
  imports: [ButtonModule, ConfirmDialogComponent],
  templateUrl: './ringing-action.component.html',
  styleUrl: './ringing-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RingingActionComponent {
  isAlarmArmed = input.required<boolean>();
  isRinging = input.required<boolean>();
  isSubmitted = input.required<boolean>();
  isModalVisible = signal(false);
  ringingRequested = output<void>();

  constructor () {
    effect(() => {
      if (this.isSubmitted()) this.resetVisibilityState();
    });
  }

  onClick () {
    if (this.isRinging()) {
      this.ringingRequested.emit();
    } else {
      this.isModalVisible.set(true);
    }
  }

  onConfirmation (confirm: boolean) {
    if (!confirm) {
      this.isModalVisible.set(false);
    } else {
      this.ringingRequested.emit();
    }
  }

  private resetVisibilityState () {
    this.isModalVisible.set(false);
  }
}
