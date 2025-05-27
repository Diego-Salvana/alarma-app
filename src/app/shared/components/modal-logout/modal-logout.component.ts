import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-modal-logout',
  imports: [ConfirmDialogModule],
  templateUrl: './modal-logout.component.html',
  styleUrl: './modal-logout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class ModalLogoutComponent {
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  showModal = input.required<boolean>();
  closeModal = output();

  constructor () {
    effect(() => {
      if (this.showModal()) this.confirm();
    });
  }

  confirm () {
    this.confirmationService.confirm({
      header: 'Cerrar Sesión',
      message: '¿Está seguro de cerrar sesión?',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
        styleClass: '!px-6'
      },
      acceptButtonProps: {
        label: 'Sí',
        styleClass: '!px-6'
      },
      accept: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
      }
    });
  }

  resetShowModal () {
    this.closeModal.emit();
  }
}
