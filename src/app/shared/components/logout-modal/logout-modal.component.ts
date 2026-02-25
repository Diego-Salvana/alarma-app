import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CurrentUserService } from '../../../dashboard/services';

@Component({
  selector: 'app-logout-modal',
  imports: [ConfirmDialogModule],
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class LogoutModalComponent {
  private router = inject(Router);
  private userService = inject(CurrentUserService);
  private confirmationService = inject(ConfirmationService);
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
        this.userService.logout();
        this.router.navigate(['/auth']);
      }
    });
  }

  resetShowModal () {
    this.closeModal.emit();
  }
}
