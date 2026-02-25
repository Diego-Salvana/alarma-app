import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CurrentHouseService } from '../../services';
import { HouseResponse, State } from '../../../shared/interfaces';

@Component({
  selector: 'app-house-card',
  imports: [CommonModule, CardModule],
  templateUrl: './house-card.component.html',
  styleUrl: './house-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseCardComponent {
  private currentHouseService = inject(CurrentHouseService);
  private router = inject(Router);
  readonly house = input.required<HouseResponse>();
  readonly isAlarmArmed = computed(() => this.house()?.alarmaEncendida === State.ON);
  readonly isRinging = computed(() => this.house()?.sonando);

  goHouse () {
    this.currentHouseService.loadHouseById(this.house()._id);
    this.router.navigate(['/dashboard', 'hub']);
  }
}
