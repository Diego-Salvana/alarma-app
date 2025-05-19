import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { BtnEditCardComponent, ModalHouseComponent } from '../../components';
import { HouseProp } from '../../interfaces';

interface EventItem {
  status?: string;
  date?: string;
  hour?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-sensor',
  imports: [CardModule, TimelineModule, BtnEditCardComponent, ModalHouseComponent],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorComponent implements OnInit {
  @Input('sensor') sensorId!: string;
  events: EventItem[];
  visible = false;
  houseProp!: HouseProp;
  sensorNumber = 1;
  sensorType = 'Movimiento';
  sensorName = 'Comedor';

  constructor () {
    this.events = [
      { status: 'Ordered', date: '15/10/2020', hour: '10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
      { status: 'Processing', date: '15/10/2020', hour: '14:00', icon: 'pi pi-cog', color: '#673AB7' },
      { status: 'Shipped', date: '15/10/2020', hour: '16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
      { status: 'Delivered', date: '16/10/2020', hour: '10:00', icon: 'pi pi-check', color: '#607D8B' }
    ];
  }

  ngOnInit (): void {
    //
  }
  
  showDialog () {
    this.visible = true;
    this.houseProp = 'sensorName';
  }
  
  closeDialog () {
    this.visible = false;
  }
}
