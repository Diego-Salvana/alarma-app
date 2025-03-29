import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-house-card',
  imports: [CardModule, RouterLink],
  templateUrl: './house-card.component.html',
  styleUrl: './house-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseCardComponent { }
