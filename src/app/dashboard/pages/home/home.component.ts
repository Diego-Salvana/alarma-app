import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HouseCardComponent } from '../../components/house-card/house-card.component';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  cards: any[] = [1, 2, 4, 5, 6, 7, 8, 9];
}
