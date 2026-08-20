import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { ActiveRouteService } from '../../services';

@Component({
  selector: 'app-nav-bar',
  imports: [ButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
  private activeRouteService = inject(ActiveRouteService);
  isHome = computed(() => this.activeRouteService.activeSection() === 'home');
}
