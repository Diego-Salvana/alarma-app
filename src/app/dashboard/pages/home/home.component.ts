import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HouseCardComponent } from '../../components';
import { CurrentUserService } from '../../services';
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
  readonly houses = this.userService.houses;
  readonly isloading = this.userService.isLoading;

  navigateToProfile () {
    this.router.navigateByUrl('/dashboard/profile');
  }
}
