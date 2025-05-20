import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, ModalExclusionComponent } from '../../components';
import { Sensor } from '../../interfaces';
import { HouseService } from '../../services';

@Component({
  selector: 'app-hub',
  imports: [ButtonModule, SensorListComponent, ModalExclusionComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent implements OnInit {
  private houseService = inject(HouseService);
  visible = false;
  sensors: Sensor[] = [
    { id: 1, nombre: 'Comerdor', estado: true },
    { id: 2, nombre: 'Patio', estado: false },
    { id: 3, nombre: 'Garage', estado: true },
    { id: 4, nombre: 'Sensor_4', estado: true },
    { id: 5, nombre: 'Sensor_5', estado: true },
    { id: 6, nombre: 'Sensor_6', estado: false }
  ];

  ngOnInit () {
    console.log(this.houseService.currentHouse);
    this.houseService.getHouse().subscribe({
      next: (house) => {
        console.log(house);
      }
    });
  }

  showDialog () {
    this.visible = true;
  }
  
  closeDialog () {
    this.visible = false;
  }
}
