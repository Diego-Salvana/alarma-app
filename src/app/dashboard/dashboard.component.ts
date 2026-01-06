import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent, NavBarComponent, SideBarComponent } from './components';
import { ActiveRouteService, CurrentHouseService, CurrentUserService } from './services';
import { ToastService } from '../shared/services';
import { AlertService } from './services/alert.service';
import { Estado } from '../shared/interfaces';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, HeaderComponent, NavBarComponent, SideBarComponent, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private activeRouteService = inject(ActiveRouteService);
  private alertService = inject(AlertService);
  private userService = inject(CurrentUserService);
  private currentHouseService = inject(CurrentHouseService);
  private toastService = inject(ToastService);
  readonly isHome = computed(() => this.activeRouteService.activeSection() === 'home');

  constructor () {
    effect(() => {
      const warning = this.alertService.houseWarning();
      if (warning) this.toastService.alert(warning.message);
    });

    effect(() => {
      const triggeredAlert = this.alertService.triggerAlert();
      if (!triggeredAlert) return;
      
      const ringing = triggeredAlert.state === Estado.ENCENDIDO;
      this.toastService.alert(
        `Alarma ${ringing ? 'sonando' : 'apagada'} en ${triggeredAlert.house}`
      );
    });
  }

  ngOnInit () {
    this.userService.loadUser();
    this.currentHouseService.getHouse();
  }
}
