import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogComponent } from '../modals';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-disarm-action',
  imports: [Button, ConfirmDialogComponent],
  templateUrl: './disarm-action.component.html',
  styleUrl: './disarm-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisarmActionComponent {
  private toastService = inject(ToastService);
  isAlarmArmed = input.required<boolean>();
  isSubmitted = input.required<boolean>();
  isModalVisible = signal(false);
  disarmRequested = output<void>();

  constructor () {
    effect(() => {
      if (this.isSubmitted()) this.resetVisibilityState();
    });
  }

  onClick () {
    if (this.isAlarmArmed()) {
      this.isModalVisible.set(true);
    } else {
      this.toastService.info('La alarma se encuentra desactivada');
    }
  }

  onConfirmation (confirm: boolean) {
    if (!confirm) {
      this.isModalVisible.set(false);
    } else {
      this.disarmRequested.emit();
    }
  }

  private resetVisibilityState () {
    this.isModalVisible.set(false);
  }
}
