import { TitleCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, RingingActionComponent } from '../../components';
import { CurrentHouseService } from '../../services';
import { ExclusionFormValues } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { DisarmActionComponent } from '../../components/disarm-action/disarm-action.component';
import { ArmActionComponent } from '../../components/arm-action/arm-action.component';

@Component({
  selector: 'app-hub',
  imports: [TitleCasePipe, NgClass, ButtonModule, SensorListComponent, RingingActionComponent, DisarmActionComponent, ArmActionComponent],
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
  readonly isAlarmArmed = this.currentHouseService.isAlarmArmed;
  readonly isRinging = this.currentHouseService.isRinging;
  readonly sensors = computed(() => this.house()?.sensors ?? []);
  isArmingSubmitted = signal(true);
  isRingingSubmitted = signal(true);
  isDisarmingSubmitted = signal(true);

  constructor () {
    effect(() => {
      this.isAlarmArmed();

      this.isDisarmingSubmitted.set(true);
      this.isArmingSubmitted.set(true);
      clearTimeout(this.actionTimeOut);
    });

    effect(() => {
      this.isRinging();

      this.isRingingSubmitted.set(true);
      clearTimeout(this.actionTimeOut);
    });
  }

  /** Ordena iniciar la activación de la alarma. Genera un timeout con tiempo límite de espera para la respuesta por `websocket`. */
  onArmAlarm (values: ExclusionFormValues) {
    this.isArmingSubmitted.set(false);

    this.currentHouseService
      .armAlarm(values)
      .subscribe({
        next: _ => {
          this.actionTimeOut = setTimeout(() => {
            this.isArmingSubmitted.set(true);
            this.toastService.error('No se pudo activar la alarma');
          }, 5000);
        },
        error: err => {
          this.toastService.error(err.error.errors?.[0].message ?? 'Error al activar la alarma');
          this.isArmingSubmitted.set(true);
        }
      });
  }

  /** Ordena iniciar la desactivación de la alarma si `disarm` es `true`, de lo contrario cierra el modal. Genera un timeout con tiempo límite de espera para la respuesta por `websocket`. */
  onDisarmConfirmation () {
    this.isDisarmingSubmitted.set(false);

    this.currentHouseService
      .disarmAlarm()
      .subscribe({
        next: _ => {
          this.actionTimeOut = setTimeout(() => {
            this.isDisarmingSubmitted.set(true);
            this.toastService.error('No se pudo desactivar la alarma');
          }, 5000);
        },
        error: err => {
          this.isDisarmingSubmitted.set(true);
          this.toastService.error(err.error.message);
        }
      });
  }

  /** Alterna el estado `sonando` de la casa actual. */
  onToggleRinging () {
    const nextState = !this.isRinging();
    
    this.isRingingSubmitted.set(false);
    
    this.currentHouseService
      .toggleRinging({ sonando: nextState })
      .subscribe({
        next: _ => {
          this.actionTimeOut = setTimeout(() => {
            this.isRingingSubmitted.set(true);
            this.toastService.error('No pudo completarse la acción');
          }, 5000);
        },
        error: err => {
          this.isRingingSubmitted.set(true);
          this.toastService.error(err.error.message);
        }
      });
  }
}
