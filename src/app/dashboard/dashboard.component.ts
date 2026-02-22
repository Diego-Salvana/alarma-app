import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, untracked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent, NavBarComponent, SideBarComponent } from './components';
import { ActiveRouteService, CurrentHouseService, CurrentUserService } from './services';
import { ToastService } from '../shared/services';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, HeaderComponent, NavBarComponent, SideBarComponent, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private activeRouteService = inject(ActiveRouteService);
  private userService = inject(CurrentUserService);
  private currentHouseService = inject(CurrentHouseService);
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);
  readonly isHome = computed(() => this.activeRouteService.activeSection() === 'home');

  constructor () {
    effect(onCleanup => {
      const username = this.userService.username();
      if (!username) return;

      this.alertService.initListeners(username);
      onCleanup(() => this.alertService.stopListeners());
    });

    effect(() => {
      const warning = this.alertService.houseWarning();
      if (warning) this.toastService.alert(warning.message);
    });

    effect(() => {
      const triggeredAlert = this.alertService.triggerAlert();
      if (!triggeredAlert) return;
      
      this.toastService.alert(
        `Alarma ${
          triggeredAlert.ringing ? 'SONANDO' : 'APAGADA'
        } en ${
          this.searchHouse(triggeredAlert.house) ?? 'una de las casas'
        }`
      );
    });
  }

  ngOnInit () {
    this.userService.loadUser();
    this.currentHouseService.loadCurrentHouse();
  }

  /** Busca una casa entre las del usuario. */
  private searchHouse (houseName: string): string | null {
    return untracked(() => {
      const houses = this.userService.houses();
      const house = houses.find(h => h.nombreCasa === houseName);
      
      return house?.nombre ?? null;
    });
  }
}
