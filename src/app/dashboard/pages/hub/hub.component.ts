import { TitleCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, ModalExclusionComponent, ExclusionFormValue } from '../../components';
import { CurrentHouseService } from '../../services';
import { AlarmActivation, Estado, HouseResponse, Sensor } from '../../../shared/interfaces';
import { SocketService, ToastService } from '../../../shared/services';
import { ConfirmDisarmComponent } from '../../components/modals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WS_ALARM_ARMING } from '../../../env';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hub',
  imports: [TitleCasePipe, NgClass, ButtonModule, SensorListComponent, ModalExclusionComponent, ConfirmDisarmComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent {
  private currentHouseService = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  private socketService = inject(SocketService);
  private timeOutId!: ReturnType<typeof setTimeout>;
  private readonly username = this.currentHouseService.username;
  readonly house: Signal<HouseResponse | null> = this.currentHouseService.house;
  readonly loading: Signal<boolean> = this.currentHouseService.loading;
  readonly isActive = computed<boolean>(() => this.house()?.alarmaEncendida === Estado.ENCENDIDO);
  readonly sensorList = computed<Sensor[]>(() => this.house()?.sensores ?? []);
  submitCompleted = signal(true);
  exclusionFormVisible = false;
  disarmConfirmationVisible = signal(false);
  disarmEnd = signal(true);

  constructor () {
    // Si aún no hay una casa cargada intenta cargarla.
    if (!this.loading() && !this.house()) {
      this.currentHouseService.getHouse()
        .pipe(takeUntilDestroyed())
        .subscribe({
          error: e => {
            const message = typeof e.message === 'string' ? e.message : e.error.message;
            this.toastService.error(message);
          }
        });
    }
    
    // Subscripción a eventos de activación de la alarma.
    effect(onCleanup => {
      const sub = this.subscribeToHouseSocket(this.username(), this.house()?.nombreCasa ?? '');
      
      onCleanup(() => sub.unsubscribe());
    });

    // Subscripción a eventos de error.
    // this.socketService.on<SocketError>('error')
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(data => {
    //     if (data.event === 'alarmActivation') {
    //       this.closeExclusionForm();
    //       this.submitCompleted.set(true);
    //       this.toastService.error(data.message);
    //       clearTimeout(this.timeOutId);
    //     }
    //   });
  }
    
  private subscribeToHouseSocket (username: string, houseName: string): Subscription {
    return this.socketService
      .on<AlarmActivation>(`${WS_ALARM_ARMING}/${username}/${houseName}`)
      .subscribe(data => {
        try {
          this.currentHouseService.updateHouse(data);
        } catch {
          this.toastService.error('Ocurrió un error al actualizar la casa.');
        }
        this.closeExclusionForm();
        this.submitCompleted.set(true);
        this.disarmConfirmationAction(false);
        this.disarmEnd.set(true);
        clearTimeout(this.timeOutId);
      });
  }

  /** Ordena iniciar la activación de la alarma. Genera un timeout con tiempo límite de espera para la respuesta por `websocket`. */
  activateAlarm (value: ExclusionFormValue) {
    this.submitCompleted.set(false);

    const exclusionArray = Object
      .entries(value)
      .map(([numeroSensor, estado]) => ({ numeroSensor, estado }));

    this.currentHouseService.armAlarm(exclusionArray).subscribe({
      next: _ => {
        this.timeOutId = setTimeout(() => {
          this.submitCompleted.set(true);
          this.exclusionFormVisible = false;
          this.toastService.error('No se pudo activar la alarma.');
        }, 5000);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitCompleted.set(true);
        this.exclusionFormVisible = false;
      }
    });
  }

  /** Ordena iniciar la desactivación de la alarma si `disarm` es `true`, de lo contrario cierra el modal. Genera un timeout con tiempo límite de espera para la respuesta por `websocket`. */
  disarmConfirmationAction (disarm: boolean) {
    if (!disarm) {
      this.disarmConfirmationVisible.set(false);
    } else {
      this.disarmEnd.set(false);

      this.currentHouseService.disarmAlarm().subscribe({
        next: _ => {
          this.timeOutId = setTimeout(() => {
            this.disarmEnd.set(true);
            this.disarmConfirmationVisible.set(false);
            this.toastService.error('No se pudo desactivar la alarma.');
          }, 5000);
        },
        error: e => {
          this.toastService.error(e.error.message);
          this.disarmEnd.set(true);
          this.disarmConfirmationVisible.set(false);
        }
      });
    }
  }

  showExclusionForm () {
    if (this.isActive()) {
      this.toastService.info('La alarma ya está activada.');
      return;
    }

    this.exclusionFormVisible = true;
  }

  closeExclusionForm () {
    this.exclusionFormVisible = false;
  }

  showDisarmConfirmation () {
    if (!this.isActive()) {
      this.toastService.info('La alarma se encuentra desactivada.');
      return;
    }

    this.disarmConfirmationVisible.set(true);
  }
}
