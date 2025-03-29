import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { ActiveRouteService } from './services/active-route.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, HeaderComponent, NavBarComponent, SideBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private activeRouteService = inject(ActiveRouteService);
  isHome = this.activeRouteService.isHome;
}
