import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { House } from '../../interfaces';

@Component({
  selector: 'app-house-card',
  imports: [CommonModule, CardModule, RouterLink],
  templateUrl: './house-card.component.html',
  styleUrl: './house-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseCardComponent implements OnInit {
  house = input.required<House>();
  isActivated!: boolean;

  ngOnInit () {
    this.isActivated = this.house().central === 'activada';
  }
}
