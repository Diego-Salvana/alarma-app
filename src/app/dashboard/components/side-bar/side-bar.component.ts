import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ActiveRouteService } from '../../services';
import { ModalLogoutComponent } from '../../../shared/components';

@Component({
  selector: 'app-side-bar',
  imports: [ButtonModule, RouterLink, RouterLinkActive, ModalLogoutComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent {
  private activeRouteService = inject(ActiveRouteService);
  isHome = computed(() => this.activeRouteService.activeSection() === 'home');
  showDialog = signal(false);
  
  toggleDarkMode () {
    const htmlElement = document.querySelector('html');

    if (htmlElement) {
      htmlElement.classList.toggle('my-app-dark');
    }
  }
  
  logout () {
    this.showDialog.set(true);
  }
  
  cancelLogout () {
    this.showDialog.set(false);
  }
}
