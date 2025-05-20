import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ActiveRouteService } from '../../services';

@Component({
  selector: 'app-header',
  imports: [ConfirmDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);
  private activeRouteService = inject(ActiveRouteService);
  confirmationService = inject(ConfirmationService);
  isHome = computed(() => this.activeRouteService.activeSection() === 'home');

  navigateTo () {
    switch (this.activeRouteService.activeSection()) {
      case 'home':
        this.confirm();
        break;
      case 'hub':
        this.router.navigate(['dashboard', 'home']);
        break;
      case 'sensor':
        this.router.navigate(['dashboard', 'hub']);
        break;
      case 'history':
        this.router.navigate(['dashboard', 'hub']);
        break;
      case 'profile':
        this.router.navigate(['dashboard', 'hub']);
        break;
      case 'house':
        this.router.navigate(['dashboard', 'profile']);
        break;
    }
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
}
