import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent, NavBarComponent, SideBarComponent } from './components';
import { ActiveRouteService, CurrentHouseService } from './services';
import { ToastService } from '../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, HeaderComponent, NavBarComponent, SideBarComponent, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private activeRouteService = inject(ActiveRouteService);
  private toastService = inject(ToastService);
  private currentHouseController = inject(CurrentHouseService);
  isHome = computed(() => this.activeRouteService.activeSection() === 'home');

  // Dispara la carga de la casa actual y así queda disponible para los componentes hijos.
  constructor () {
    const token = localStorage.getItem('token');

    if (token) {
      this.currentHouseController.getHouse()
        .pipe(takeUntilDestroyed())
        .subscribe({
          error: e => {
            this.toastService.error(e.error?.message || e.message);
          }
        });
    }
  }
}
