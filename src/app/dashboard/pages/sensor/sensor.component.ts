import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { BtnEditCardComponent, ModalHouseComponent } from '../../components';
import { ModalDataTransfer, HouseProp } from '../../interfaces';
import { SensorService } from '../../services';
import { Sensor } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-sensor',
  imports: [CardModule, TimelineModule, BtnEditCardComponent, ModalHouseComponent, TitleCasePipe, DatePipe],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorComponent implements OnInit {
  private sensorService = inject(SensorService);
  private toastService = inject(ToastService);
  @Input() sensorNumber!: string;
  sensor = signal<Sensor | null>(null);
  noSensor = signal(false);
  visible = false;
  houseProp!: HouseProp;
  submitedEnd = signal(true);

  ngOnInit () {
    this.sensorService.getOne(this.sensorNumber).subscribe({
      next: sensor => {
        this.sensor.set(sensor);
      },
      error: e => {
        this.noSensor.set(true);
        this.toastService.error(e.error.message);
      }
    });
  }

  onSubmit (data: ModalDataTransfer) {
    this.submitedEnd.set(false);

    if (!data.sensorName) {
      this.toastService.error('El nombre del sensor no es válido');
      return;
    }
      
    this.sensorService.modifyName(Number(this.sensorNumber), data.sensorName).subscribe({
      next: sensor => {
        this.sensor.set(sensor);
        this.submitedEnd.set(true);
        this.visible = false;
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitedEnd.set(true);
        this.visible = false;
      }
    });
  }
  
  showDialog () {
    this.visible = true;
    this.houseProp = 'sensorName';
  }
  
  closeDialog () {
    this.visible = false;
  }
}
