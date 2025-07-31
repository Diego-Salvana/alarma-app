import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent, NavBarComponent, SideBarComponent } from './components';
import { ActiveRouteService } from './services';
import { SocketService } from '../shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, HeaderComponent, NavBarComponent, SideBarComponent, ToastModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy {
  private activeRouteService = inject(ActiveRouteService);
  private socketSubscription: Subscription;
  private socketService = inject(SocketService);
  isHome = computed(() => this.activeRouteService.activeSection() === 'home');

  constructor () {
    this.socketSubscription = this.socketService.on('topico/usuario_1').subscribe({
      next: data => {
        console.log('Data desde el back: ', data);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  ngOnDestroy () {
    this.socketSubscription.unsubscribe();
  }
}
