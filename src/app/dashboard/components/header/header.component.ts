import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveRouteService } from '../../services';
import { ModalLogoutComponent } from '../../../shared/components';

@Component({
  selector: 'app-header',
  imports: [ModalLogoutComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);
  private activeRouteService = inject(ActiveRouteService);
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

  cancelLogout () {
    this.showDialog.set(false);
  }
}
