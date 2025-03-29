import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';

interface EventItem {
  status?: string;
  date?: string;
  hour?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-central-history',
  imports: [TimelineModule],
  templateUrl: './central-history.component.html',
  styleUrl: './central-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralHistoryComponent {
  events: EventItem[];

  constructor () {
    this.events = [
      { status: 'Patio', date: '15/10/2020', hour: '10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
      { status: 'Comedor', date: '15/10/2020', hour: '14:00', icon: 'pi pi-cog', color: '#673AB7' },
      { status: 'Garage', date: '15/10/2020', hour: '16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
      { status: 'Delivered', date: '16/10/2020', hour: '10:00', icon: 'pi pi-check', color: '#607D8B' }
    ];
  }
}
