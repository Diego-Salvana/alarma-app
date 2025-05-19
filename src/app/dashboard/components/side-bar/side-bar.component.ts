import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ActiveRouteService } from '../../services/active-route.service';

@Component({
  selector: 'app-side-bar',
  imports: [ButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent {
  private activeRouteService = inject(ActiveRouteService);
  isHome = computed(() => this.activeRouteService.activeSection() === 'home');
  
  toggleDarkMode () {
    const htmlElement = document.querySelector('html');

    if (htmlElement) {
      htmlElement.classList.toggle('my-app-dark');
    }
  }
}
