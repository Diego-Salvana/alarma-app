import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ActiveRouteService } from '../../services';
import { LogoutModalComponent } from '../../../shared/components';

@Component({
  selector: 'app-header',
  imports: [LogoutModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);
  private activeRouteService = inject(ActiveRouteService);
  title = 'Alarma';
  showDialog = signal(false);
  isHome = computed(() => this.activeRouteService.activeSection() === 'home');

  navigateTo () {
    switch (this.activeRouteService.activeSection()) {
      case 'home':
        this.showDialog.set(true);
        break;
      case 'hub':
        this.router.navigate(['dashboard', 'home']);
        break;
      case 'house':
        this.router.navigate(['dashboard', 'profile']);
        break;
      default:
        this.router.navigate(['dashboard', 'hub']);
        break;
    }
  }

  cancelLogout () {
    this.showDialog.set(false);
  }
}
