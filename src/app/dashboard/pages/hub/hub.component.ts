import { TitleCasePipe, UpperCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, ModalExclusionComponent, ExclusionFormValue } from '../../components';
import { HouseService } from '../../services';
import { Estado, HouseResponse, Sensor } from '../../../shared/interfaces';
import { SocketService, ToastService } from '../../../shared/services';
import { ConfirmDisarmComponent } from '../../components/modals/confirm-disarm/confirm-disarm.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { AlarmActivation } from '../../../shared/interfaces/websockets-models';
import { cloneDeep } from 'lodash';

/* Mover constantes */
const alarmOnEvent = 'alarmaEncendida';
const userPrefix = 'user_';
const currentUser = 'pedro.sala8@example.com';

@Component({
  selector: 'app-hub',
  imports: [UpperCasePipe, TitleCasePipe, NgClass, ButtonModule, SensorListComponent, ModalExclusionComponent, ConfirmDisarmComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent implements OnDestroy {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  private socketsService = inject(SocketService);
  private socketsSubscription: Subscription;
  house = signal<HouseResponse | null>(null);
  loading = signal(true);
  isActive = computed(() => this.house()?.alarmaEncendida === 'On');
  sensors = computed<Sensor[]>(() => this.house()?.sensores ?? []);
  submitEnd = signal(true);
  visible = false;
  showConfirmDisarm = signal(false);
  disarmEnd = signal(true);

  constructor () {
    this.socketsSubscription =
      this.socketsService.on<AlarmActivation>(`${alarmOnEvent}/${userPrefix}${currentUser}`).subscribe({
        next: data => {
          this.updateHouse(data);
        },
        error: e => {
          console.log(e);
        }
      });

    this.houseService.getHouse(true).pipe(takeUntilDestroyed()).subscribe({
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
  }

  ngOnDestroy () {
    this.socketsSubscription.unsubscribe();
  }

  activeAlarm (value: ExclusionFormValue) {
    this.submitEnd.set(false);

    const exclusionArray = Object
      .entries(value)
      .map(([numeroSensor, estado]) => ({ numeroSensor, estado }));

    this.houseService.activeAlarm(exclusionArray).subscribe({
      next: houseResponse => {
        this.house.set(houseResponse);
        this.submitEnd.set(true);
        this.visible = false;
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitEnd.set(true);
        this.visible = false;
      }
    });
  }

  showDialog () {
    if (this.isActive()) {
      this.toastService.info('La alarma ya está activada.');
      return;
    }

    this.visible = true;
  }

  closeDialog () {
    this.visible = false;
  }

  showDisarmConfirmation () {
    if (!this.isActive()) {
      this.toastService.info('La alarma se encuentra desactivada.');
      return;
    }

    this.showConfirmDisarm.set(true);
  }

  closeDisarmConfirmation (disarm: boolean) {
    if (!disarm) {
      this.showConfirmDisarm.set(false);
    } else {
      this.disarmEnd.set(false);

      this.houseService.disarmAlarm().subscribe({
        next: houseResponse => {
          this.house.set(houseResponse);
          this.disarmEnd.set(true);
          this.showConfirmDisarm.set(false);
        },
        error: e => {
          this.toastService.error(e.error.message);
          this.disarmEnd.set(true);
          this.showConfirmDisarm.set(false);
        }
      });
    }
  }

  private updateHouse (info: AlarmActivation) {
    const updatedHouse = cloneDeep(this.house());

    if (!updatedHouse) {
      throw new Error('No se encontró la casa al momento de actualizarla.');
    }

    updatedHouse.alarmaEncendida = info.isActive ? Estado.ENCENDIDO : Estado.APAGADO;
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
