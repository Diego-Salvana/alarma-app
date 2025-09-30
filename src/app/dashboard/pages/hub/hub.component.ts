import { TitleCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, ModalExclusionComponent, ExclusionFormValue } from '../../components';
import { CurrentHouseService } from '../../services';
import { AlarmActivation, Estado, HouseResponse, Sensor, SocketError } from '../../../shared/interfaces';
import { SocketService, ToastService } from '../../../shared/services';
import { ConfirmDisarmComponent } from '../../components/modals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { cloneDeep } from 'lodash';
import { alarmOnEvent, currentUser, userPrefix } from '../../../env';

@Component({
  selector: 'app-hub',
  imports: [TitleCasePipe, NgClass, ButtonModule, SensorListComponent, ModalExclusionComponent, ConfirmDisarmComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent {
  private currentHouseController = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  private socketsService = inject(SocketService);
  house = signal<HouseResponse | null>(null);
  loading = signal(true);
  isActive = computed(() => this.house()?.alarmaEncendida === 'On');
  sensors = computed<Sensor[]>(() => this.house()?.sensores ?? []);
  submitCompleted = signal(true);
  exclusionFormVisible = false;
  disarmConfirmationVisible = signal(false);
  disarmEnd = signal(true);

  constructor () {
    // Obtiene la casa actual.
    this.currentHouseController.getHouse().pipe(takeUntilDestroyed()).subscribe({
      next: houseResponse => {
        this.house.set(houseResponse);
        this.loading.set(false);
      },
      error: e => {
        const message = typeof e.message === 'string' ? e.message : e.error.message;
        this.toastService.error(message);
        this.loading.set(false);
      }
    });

    // Subscripción a eventos de activación de la alarma.
    this.socketsService.on<AlarmActivation>(`${alarmOnEvent}/${userPrefix}${currentUser}`)
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.updateHouse(data);
        this.closeExclusionForm();
        this.submitCompleted.set(true);
        this.disarmConfirmationAction(false);
        this.disarmEnd.set(true);
      });

    // Subscripción a eventos de error.
    this.socketsService.on<SocketError>('error')
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        if (data.event === 'alarmActivation') {
          console.log(data);

          this.closeExclusionForm();
          this.submitCompleted.set(true);
          this.toastService.error(data.message);
        }
      });
  }

  /** Ordena iniciar la activación de la alarma. */
  activateAlarm (value: ExclusionFormValue) {
    this.submitCompleted.set(false);

    const exclusionArray = Object
      .entries(value)
      .map(([numeroSensor, estado]) => ({ numeroSensor, estado }));

    this.currentHouseController.armAlarm(exclusionArray).subscribe({
      next: activationResponse => {
        console.log(activationResponse);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitCompleted.set(true);
        this.exclusionFormVisible = false;
      }
    });
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

  /** Ordena iniciar la desactivación de la alarma si `disarm` es `true`, de lo contrario cierra el modal. */
  disarmConfirmationAction (disarm: boolean) {
    if (!disarm) {
      this.disarmConfirmationVisible.set(false);
    } else {
      this.disarmEnd.set(false);

      this.currentHouseController.disarmAlarm().subscribe({
        next: disarmResponse => {
          console.log(disarmResponse);
        },
        error: e => {
          this.toastService.error(e.error.message);
          this.disarmEnd.set(true);
          this.disarmConfirmationVisible.set(false);
        }
      });
    }
  }

  /** Actualiza el estado la casa y los sensores con la información recibida por `websocket`. */
  private updateHouse (info: AlarmActivation) {
    const updatedHouse = cloneDeep(this.house());

    if (!updatedHouse) {
      throw new Error('Ocurrió un error al actualizar la casa.');
    }

    updatedHouse.alarmaEncendida = info.state;
    updatedHouse.sensores?.forEach((sensor, index) => {
      if (!updatedHouse.sensores) return;

      if (info.excludedSensors.includes(sensor.numeroSensor.toString())) {
        updatedHouse.sensores[index].estado = Estado.APAGADO;
      } else {
        updatedHouse.sensores[index].estado = Estado.ENCENDIDO;
      }
    });

    this.house.set(updatedHouse);
  }
}
