import { TitleCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, ExclusionModalComponent, ExclusionFormValue } from '../../components';
import { CurrentHouseService } from '../../services';
import { Estado } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { ConfirmDialogComponent } from '../../components/modals';

@Component({
  selector: 'app-hub',
  imports: [TitleCasePipe, NgClass, ButtonModule, SensorListComponent, ExclusionModalComponent, ConfirmDialogComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent {
  private currentHouseService = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  private actionTimeOut!: ReturnType<typeof setTimeout>;
  readonly house = this.currentHouseService.house;
  readonly isLoading = this.currentHouseService.isLoading;
  readonly isAlarmArmed = computed(() => this.house()?.alarmaEncendida === Estado.ENCENDIDO);
  readonly isRinging = computed(() => this.house()?.sonando === true);
  readonly sensors = computed(() => this.house()?.sensores ?? []);
  isExclusionFormVisible = false;
  isArmingSubmitted = signal(true);
  isDisarmingConfirmationVisible = signal(false);
  isDisarmingSubmitted = signal(true);
  isRingingConfirmationVisible = signal(false);
  isRingingSubmitted = signal(true);

  constructor () {
    // Reacción al armado/desarmado de la alarma.
    effect(() => {
      this.isAlarmArmed();

      this.closeExclusionForm();
      this.isArmingSubmitted.set(true);
      this.onDisarmConfirmation(false);
      this.isDisarmingSubmitted.set(true);
      clearTimeout(this.actionTimeOut);
    });

    // Reacción a activación/desactivación de la sirena.
    effect(() => {
      this.isRinging();

      this.isRingingSubmitted.set(true);
      this.isRingingConfirmationVisible.set(false);
      clearTimeout(this.actionTimeOut);
    });
  }

  showExclusionForm () {
    if (this.isAlarmArmed()) {
      this.toastService.info('La alarma ya está activada.');
      return;
    }

    this.isExclusionFormVisible = true;
  }

  closeExclusionForm () {
    this.isExclusionFormVisible = false;
  }

  /** Ordena iniciar la activación de la alarma. Genera un timeout con tiempo límite de espera para la respuesta por `websocket`. */
  onArmAlarm (value: ExclusionFormValue) {
    this.isArmingSubmitted.set(false);

    const exclusionArray = Object
      .entries(value)
      .map(([numeroSensor, estado]) => ({ numeroSensor, estado }));

    this.currentHouseService.armAlarm(exclusionArray).subscribe({
      next: _ => {
        this.actionTimeOut = setTimeout(() => {
          this.isArmingSubmitted.set(true);
          this.isExclusionFormVisible = false;
          this.toastService.error('No se pudo activar la alarma.');
        }, 5000);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.isArmingSubmitted.set(true);
        this.isExclusionFormVisible = false;
      }
    });
  }

  showDisarmConfirmation () {
    if (!this.isAlarmArmed()) {
      this.toastService.info('La alarma se encuentra desactivada.');
      return;
    }

    this.isDisarmingConfirmationVisible.set(true);
  }

  /** Ordena iniciar la desactivación de la alarma si `disarm` es `true`, de lo contrario cierra el modal. Genera un timeout con tiempo límite de espera para la respuesta por `websocket`. */
  onDisarmConfirmation (disarm: boolean) {
    if (!disarm) {
      this.isDisarmingConfirmationVisible.set(false);
    } else {
      this.isDisarmingSubmitted.set(false);

      this.currentHouseService.disarmAlarm().subscribe({
        next: _ => {
          this.actionTimeOut = setTimeout(() => {
            this.isDisarmingSubmitted.set(true);
            this.isDisarmingConfirmationVisible.set(false);
            this.toastService.error('No se pudo desactivar la alarma.');
          }, 5000);
        },
        error: e => {
          this.toastService.error(e.error.message);
          this.isDisarmingSubmitted.set(true);
          this.isDisarmingConfirmationVisible.set(false);
        }
      });
    }
  }

  showRingingConfirmation () {
    this.isRinging()
      ? this.toggleRinging()
      : this.isRingingConfirmationVisible.set(true);
  }
  
  onRingingConfirmation (confirm: boolean) {
    if (!confirm) {
      this.isRingingConfirmationVisible.set(false);
    } else {
      this.isRingingSubmitted.set(false);
      this.toggleRinging();
    }
  }

  /** Alterna el estado de `sonando` de la casa actual. */
  toggleRinging () {
    const nextState = this.isRinging() ? Estado.APAGADO : Estado.ENCENDIDO;
    this.currentHouseService.toggleRinging({ state: nextState }).subscribe({
      next: _ => {
        this.actionTimeOut = setTimeout(() => {
          this.isRingingSubmitted.set(true);
          this.isRingingConfirmationVisible.set(false);
          this.toastService.error('No pudo completarse la acción.');
        }, 5000);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.isRingingSubmitted.set(true);
        this.isRingingConfirmationVisible.set(false);
      }
    });
  }
}
