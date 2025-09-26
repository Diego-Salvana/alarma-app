import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { BtnEditCardComponent, ModalHouseComponent } from '../../components';
import { ModalDataTransfer, HouseProp } from '../../interfaces';
import { SensorService } from '../../services';
import { Sensor } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-sensor',
  imports: [CardModule, TimelineModule, BtnEditCardComponent, ModalHouseComponent, TitleCasePipe, DatePipe, UpperCasePipe],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorComponent implements OnInit {
  private sensorService = inject(SensorService);
  private toastService = inject(ToastService);
  loading = signal(true);
  sensor = signal<Sensor | null>(null);
  visible = signal(false);
  houseProp: HouseProp = 'sensorName';
  submitCompleted = signal(true);
  sensorNumber = input<string>(''); // Toma el sensorNumber de la ruta

  ngOnInit () {
    this.sensorService.getOne(this.sensorNumber()).subscribe({
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

  onSubmit (data: ModalDataTransfer) {
    this.submitCompleted.set(false);

    if (!data.sensorName) {
      this.toastService.error('El nombre del sensor no es válido');
      this.submitCompleted.set(true);
      return;
    }
      
    this.sensorService.modifyName(Number(this.sensorNumber()), data.sensorName).subscribe({
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
  
  showDialog () {
    this.visible.set(true);
  }
  
  closeDialog () {
    this.visible.set(false);
  }
}
