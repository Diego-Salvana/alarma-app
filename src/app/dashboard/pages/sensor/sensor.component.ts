import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { BtnEditCardComponent, ModalHouseComponent } from '../../components';
import { ModalDataTransfer, HouseProp } from '../../interfaces';
import { CurrentHouseService } from '../../services';
import { Estado, Sensor } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sensor',
  imports: [CardModule, TimelineModule, BtnEditCardComponent, ModalHouseComponent, TitleCasePipe, DatePipe, UpperCasePipe],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorComponent implements OnInit {
  private currentHouseController = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  loading = signal(true);
  sensor = signal<Sensor | null>(null);
  visible = signal(false);
  submitCompleted = signal(true);
  houseProp: HouseProp = 'sensorName';
  sensorNumber = input<string>(''); // Toma "sensorNumber" de la ruta.
  isAlarmOn = computed(() =>
    this.currentHouseController.house()?.alarmaEncendida === Estado.ENCENDIDO
  );

  ngOnInit () {
    this.currentHouseController.getOneSensor(this.sensorNumber())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: sensor => {
          this.sensor.set(sensor);
          this.loading.set(false);
        },
        error: e => {
          this.loading.set(false);
          this.toastService.error(e.error.message);
        }
      });
  }

  /** Cambia el nombre del sensor. */
  changeName (data: ModalDataTransfer) {
    this.submitCompleted.set(false);

    if (!data.sensorName) {
      this.toastService.error('El nombre del sensor no es válido');
      this.submitCompleted.set(true);
      return;
    }
      
    this.currentHouseController.modifySensorName(Number(this.sensorNumber()), data.sensorName)
      .subscribe({
        next: sensor => {
          this.sensor.set(sensor);
          this.submitCompleted.set(true);
          this.visible.set(false);
        },
        error: e => {
          this.toastService.error(e.error.message);
          this.submitCompleted.set(true);
          this.visible.set(false);
        }
      });
  }
  
  /** Muestra el modal de cambio de nombre. */
  showDialog () {
    this.visible.set(true);
  }
  
  /** Cierra el modal de cambio de nombre. */
  closeDialog () {
    this.visible.set(false);
  }
}
