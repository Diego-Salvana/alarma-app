import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { CentralService } from '../../services/central.service';
import { HistorialConNombre } from '../../../shared/interfaces';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-central-history',
  imports: [TimelineModule, DatePipe, UpperCasePipe],
  templateUrl: './central-history.component.html',
  styleUrl: './central-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralHistoryComponent implements OnInit {
  private centralService = inject(CentralService);
  private toastService = inject(ToastService);
  history = signal<HistorialConNombre[]>([]);
  
  ngOnInit () {
    this.centralService.getHistory().subscribe({
      next: historyResponse => {
        this.history.set(historyResponse);
      },
      error: e => {
        this.toastService.error(e.error.message);
      }
    });
  }
}
