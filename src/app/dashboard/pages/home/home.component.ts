import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HouseCardComponent } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  loading = signal(true);
  sites = signal<HouseResponse[]>([]);

  constructor () {
    this.houseService.getAll()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: houses => this.sites.set(houses),
        error: err => this.toastService.error(err.error.message)
      });
  }
}
