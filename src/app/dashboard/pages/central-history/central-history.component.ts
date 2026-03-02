import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CentralEvent } from '../../../shared/interfaces';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../../shared/services';
import { CentralService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

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
  history = signal<CentralEvent[]>([]);
  
  constructor () {
    this.centralService
      .getHistory()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: historyResponse => this.history.set(historyResponse),
        error: err => this.handleHistroyError(err)
      });
  }

  private handleHistroyError (err: HttpErrorResponse) {
    err.status === 401
      ? this.toastService.error('No estás autorizado para ver el historial')
      : this.toastService.error('Ocurrió un error al obtener el historial');
  }
}
