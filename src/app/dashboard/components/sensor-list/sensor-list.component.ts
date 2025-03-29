import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-sensor-list',
  imports: [CardModule, TableModule, RouterModule],
  templateUrl: './sensor-list.component.html',
  styleUrl: './sensor-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorListComponent {
  sensors = [
    { nombre: 'Comerdor', estado: 'Activo' },
    { nombre: 'Patio', estado: 'Inactivo' },
    { nombre: 'Garage', estado: 'Activo' },
    { nombre: 'Sensor 4', estado: 'Inactivo' },
    { nombre: 'Sensor 5', estado: 'Activo' },
    { nombre: 'Sensor 6', estado: 'Inactivo' }
  ];
}
