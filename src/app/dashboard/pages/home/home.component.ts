import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HouseCardComponent } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../auth/interfaces';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private houseService = inject(HouseService);
  private messageService = inject(MessageService);
  sites = signal<HouseResponse[]>([]);
  noHouse = false;

  ngOnInit () {
    this.houseService.getAll().subscribe({
      next: houses => {
        this.sites.set(houses);

        if (this.sites().length < 1) this.noHouse = true;
      },
      error: (e) => {
        this.sites.set([]);
        this.noHouse = true;
        this.messageService.add({ severity: 'contrast', summary: 'Error', detail: e.error.message });
      }
    });
  }
}
