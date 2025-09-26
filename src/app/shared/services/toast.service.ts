import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

// Servicio para mostrar mensajes de toast
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageService = inject(MessageService);

  error (message: string) {
    this.messageService.add({ severity: 'contrast', summary: 'Error', detail: message });
  }

  info (message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }
}
