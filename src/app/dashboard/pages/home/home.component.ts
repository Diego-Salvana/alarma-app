import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { HouseCardComponent } from '../../components';
import { AlertService, CurrentUserService } from '../../services';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent, Button],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private router = inject(Router);
  private userService = inject(CurrentUserService);
  private alertService = inject(AlertService);
  readonly houses = this.userService.houses;
  readonly isloading = this.userService.isLoading;

  constructor () {
    effect(() => {
      const armAlert = this.alertService.armAlert();
      if (armAlert) {
        this.userService.updateHousesState(armAlert.house, { state: armAlert.state });
      }
    });

    effect(() => {
      const triggerAlert = this.alertService.triggerAlert();
      if (triggerAlert) {
        this.userService.updateHousesState(triggerAlert.house, { ringing: triggerAlert.ringing });
      }
    });
  }

  navigateToProfile () {
    this.router.navigateByUrl('/dashboard/profile');
  }
}
