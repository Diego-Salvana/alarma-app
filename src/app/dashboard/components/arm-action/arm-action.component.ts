import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { ExclusionModalComponent } from '../modals';
import { Button } from 'primeng/button';
import { ExclusionFormValues, Sensor } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-arm-action',
  imports: [ExclusionModalComponent, Button],
  templateUrl: './arm-action.component.html',
  styleUrl: './arm-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArmActionComponent {
  toastService = inject(ToastService);
  isAlarmArmed = input.required<boolean>();
  sensors = input.required<Sensor[]>();
  isSubmitted = input.required<boolean>();
  isModalVisible = signal(false);
  armRequested = output<ExclusionFormValues>();

  constructor () {
    effect(() => {
      if (this.isSubmitted()) this.resetVisibilityState();
    });
  }

  onClick () {
    if (this.isAlarmArmed()) {
      this.toastService.info('La alarma ya está activada.');
    } else {
      this.isModalVisible.set(true);
    }
  }

  onArmAlarm (exclusionConfig: ExclusionFormValues) {
    this.armRequested.emit(exclusionConfig);
  }

  resetVisibilityState () {
    this.isModalVisible.set(false);
  }
}
