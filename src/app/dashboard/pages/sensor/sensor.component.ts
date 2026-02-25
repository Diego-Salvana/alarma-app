import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { CurrentHouseService, SensorService } from '../../services';
import { HouseUpdate, Sensor, State } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { DetailsCardComponent } from '../../components';

@Component({
  selector: 'app-sensor',
  imports: [CardModule, TimelineModule, TitleCasePipe, DatePipe, UpperCasePipe, DetailsCardComponent],
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
  readonly isAlarmArmed = computed(
    () => this.currentHouseService.house()?.alarmaEncendida === State.ON
  );

  sensor = signal<Sensor | null>(null);
  isLoading = signal(true);
  submitted = signal(true);

  ngOnInit () {
    this.sensorService
      .getOne(this.sensorNumber())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: sensor => this.sensor.set(sensor),
        error: err => this.toastService.error(err.error.message)
      });
  }

  /** Cambia el nombre del sensor. */
  updateName (data: HouseUpdate) {
    this.submitted.set(false);

    if (!data.sensorName) {
      this.toastService.error('El nombre del sensor no es válido');
      this.submitted.set(true);
      return;
    }

    this.sensorService
      .modifyName(parseInt(this.sensorNumber()), data.sensorName)
      .pipe(finalize(() => this.submitted.set(true)))
      .subscribe({
        next: sensor => this.sensor.set(sensor),
        error: err => this.toastService.error(err.error.message)
      });
  }
}
