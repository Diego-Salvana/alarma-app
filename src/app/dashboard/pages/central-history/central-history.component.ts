import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { HistorialConNombre } from '../../../shared/interfaces';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../../shared/services';
import { CurrentHouseService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-central-history',
  imports: [TimelineModule, DatePipe],
  templateUrl: './central-history.component.html',
  styleUrl: './central-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralHistoryComponent {
  private currentHouseService = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  loading = signal(true);
  history = signal<HistorialConNombre[]>([]);
  
  constructor () {
    this.currentHouseService.getHistory()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: historyResponse => {
          this.history.set(historyResponse);
          this.loading.set(false);
        },
        error: e => {
          this.toastService.error(e.error.message);
          this.loading.set(false);
        }
      });
  }
}
