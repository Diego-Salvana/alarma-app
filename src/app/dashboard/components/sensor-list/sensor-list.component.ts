import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Sensor } from '../../../shared/interfaces';

@Component({
  selector: 'app-sensor-list',
  imports: [CardModule, TableModule, RouterModule],
  templateUrl: './sensor-list.component.html',
  styleUrl: './sensor-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorListComponent {
  sensors = input.required<Sensor[]>();
  isAlarmOn = input.required<boolean>();
}
