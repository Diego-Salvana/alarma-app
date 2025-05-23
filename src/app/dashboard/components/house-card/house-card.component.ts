import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { HouseResponse } from '../../../auth/interfaces';
import { HouseService } from '../../services';

@Component({
  selector: 'app-house-card',
  imports: [CommonModule, CardModule],
  templateUrl: './house-card.component.html',
  styleUrl: './house-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseCardComponent {
  private houseService = inject(HouseService);
  private router = inject(Router);
  house = input.required<HouseResponse>();
  isActivated = computed(() => this.house()?.alarmaEncendida === 'On');

  goHouse () {
    this.houseService.currentHouse = this.house()._id;
    this.router.navigate(['/dashboard', 'hub']);
  }
}
