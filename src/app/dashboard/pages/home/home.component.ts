import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HouseCardComponent } from '../../components';
import { CurrentUserService } from '../../services';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private userService = inject(CurrentUserService);
  readonly houses = this.userService.houses;
  readonly isloading = this.userService.isLoading;
}
