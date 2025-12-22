import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent, NavBarComponent, SideBarComponent } from './components';
import { ActiveRouteService, CurrentHouseService } from './services';
import { SocketService, ToastService } from '../shared/services';
import { WS_ALARM_ERROR } from '../env';
import { Subscription } from 'rxjs';
import { HouseSocketError } from '../shared/interfaces';

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
  private socketService = inject(SocketService);
  private currentHouseService = inject(CurrentHouseService);
  private readonly username = this.currentHouseService.username;
  readonly isHome = computed(() => this.activeRouteService.activeSection() === 'home');
  private _houseErrorEvent = signal<HouseSocketError | null>(null);
  houseErrorEvent = this._houseErrorEvent.asReadonly();

  constructor () {
    effect(onCleanup => {
      const username = this.username();
      let sub: Subscription | undefined;
      
      if (!username) {
        this.currentHouseService.getHouse().subscribe({
          error: e => this.toastService.error(e.error?.message || e.message)
        });
      } else {
        sub = this.socketService
          .on<HouseSocketError>(`${WS_ALARM_ERROR}/${username}`)
          .subscribe(data => {
            this.toastService.error(data.message);
            this._houseErrorEvent.set(data);
          });
      }

      onCleanup(() => sub?.unsubscribe());
    });
  }
}
