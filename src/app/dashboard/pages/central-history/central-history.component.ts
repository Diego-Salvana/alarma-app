import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { HistorialConNombre } from '../../../shared/interfaces';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../../shared/services';
import { CentralService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-central-history',
  imports: [TimelineModule, DatePipe],
  templateUrl: './central-history.component.html',
  styleUrl: './central-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralHistoryComponent {
  private centralService = inject(CentralService);
  private toastService = inject(ToastService);
  isLoading = signal(true);
  history = signal<HistorialConNombre[]>([]);
  
  constructor () {
    this.centralService
      .getHistory()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: historyResponse => this.history.set(historyResponse),
        error: err => this.toastService.error(err.message)
      });
  }
}
