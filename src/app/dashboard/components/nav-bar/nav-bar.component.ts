import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ActiveRouteService } from '../../services/active-route.service';

@Component({
  selector: 'app-nav-bar',
  imports: [ButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
  private activeRouteService = inject(ActiveRouteService);
  isHome = this.activeRouteService.isHome;

  toggleDarkMode () {
    const htmlElement = document.querySelector('html');

    if (htmlElement) {
      htmlElement.classList.toggle('my-app-dark');
    }
  }
}
