import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { HouseResponse } from '../../../auth/interfaces';

@Component({
  selector: 'app-house-card',
  imports: [CommonModule, CardModule, RouterLink],
  templateUrl: './house-card.component.html',
  styleUrl: './house-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseCardComponent implements OnInit {
  house = input.required<HouseResponse>();
  isActivated!: boolean;

  ngOnInit () {
    this.isActivated = this.house().alarmaEncendida === 'On';
  }
}
