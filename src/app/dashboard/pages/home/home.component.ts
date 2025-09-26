import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HouseCardComponent } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  loading = signal(true);
  sites = signal<HouseResponse[]>([]);

  ngOnInit () {
    this.houseService.getAll().subscribe({
      next: houses => {
        this.loading.set(false);
        this.sites.set(houses);
      },
      error: (e) => {
        this.loading.set(false);
        this.toastService.error(e.error.message);
      }
    });
  }
}
