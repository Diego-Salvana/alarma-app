import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { BtnEditCardComponent, HouseModalComponent } from '../../components';
import { ModalDataTransfer, HouseProp } from '../../interfaces';
import { CurrentHouseService, SensorService } from '../../services';
import { Estado, Sensor } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sensor',
  imports: [CardModule, TimelineModule, BtnEditCardComponent, HouseModalComponent, TitleCasePipe, DatePipe, UpperCasePipe],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorComponent implements OnInit {
  private currentHouseService = inject(CurrentHouseService);
  private sensorService = inject(SensorService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  readonly sensorNumber = input<string>(''); // Toma "sensorNumber" de la ruta.
  readonly houseProp: HouseProp = 'sensorName';
  sensor = signal<Sensor | null>(null);
  isLoading = signal(true);
  openModal = signal(false);
  submitted = signal(true);
  readonly isAlarmArmed = computed(
    () => this.currentHouseService.house()?.alarmaEncendida === Estado.ENCENDIDO
  );

  ngOnInit () {
    this.sensorService
      .getOne(this.sensorNumber())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: sensor => this.sensor.set(sensor),
        error: err => this.toastService.error(err.message)
      });
  }

  /** Cambia el nombre del sensor. */
  changeName (data: ModalDataTransfer) {
    this.submitted.set(false);

    if (!data.sensorName) {
      this.toastService.error('El nombre del sensor no es válido');
      this.submitted.set(true);
      return;
    }

    this.sensorService
      .modifyName(Number(this.sensorNumber()), data.sensorName)
      .pipe(
        finalize(() => {
          this.submitted.set(true);
          this.openModal.set(false);
        })
      )
      .subscribe({
        next: sensor => this.sensor.set(sensor),
        error: err => this.toastService.error(err.message)
      });
  }

  /** Muestra el modal de cambio de nombre. */
  showDialog () {
    this.openModal.set(true);
  }

  /** Cierra el modal de cambio de nombre. */
  closeDialog () {
    this.openModal.set(false);
  }
}
