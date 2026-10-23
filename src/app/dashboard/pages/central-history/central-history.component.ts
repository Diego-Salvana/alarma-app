import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { CentralEvent, ControlPanelEventType } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { CentralService } from '../../services';

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
      ? this.toastService.error('Usuario no autorizado para ver el historial')
      : this.toastService.error('Ocurrió un error al obtener el historial');
  }

  eventTitle (event: CentralEvent): string {
    switch (event.type) {
      case ControlPanelEventType.ARMED: return 'Armado';
      case ControlPanelEventType.DISARMED: return 'Desarmado';
      case ControlPanelEventType.SIREN_ON:
      case ControlPanelEventType.SIREN_OFF:
        return 'Sirena';
      case 'SENSOR': return event.deviceName ?? 'Sensor';
      default: return 'Evento';
    }
  }

  eventLabel (event: CentralEvent): string {
    switch (event.type) {
      case ControlPanelEventType.ARMED: return 'Alarma armada';
      case ControlPanelEventType.DISARMED: return 'Alarma desarmada';
      case ControlPanelEventType.SIREN_ON: return 'Sirena encendida manualmente';
      case ControlPanelEventType.SIREN_OFF: return 'Sirena de alarma desactivada';
      case 'SENSOR': return 'Disparo de alarma';
      default: return 'Evento del sistema';
    }
  }

  eventIcon (event: CentralEvent): string {
    switch (event.type) {
      case ControlPanelEventType.ARMED: return 'pi pi-lock';
      case ControlPanelEventType.DISARMED: return 'pi pi-unlock';
      case ControlPanelEventType.SIREN_ON: return 'pi pi-bell';
      case ControlPanelEventType.SIREN_OFF: return 'pi pi-bell-slash';
      case 'SENSOR': return 'pi pi-exclamation-triangle';
      default: return 'pi pi-info-circle';
    }
  }
}
