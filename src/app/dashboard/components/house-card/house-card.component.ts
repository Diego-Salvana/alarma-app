import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

import { CurrentHouseService } from '../../services';
import { House, State } from '../../../shared/interfaces';

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
  readonly house = input.required<House>();
  readonly isAlarmArmed = computed(() => this.house().alarmState === State.ON);
  readonly isRinging = computed(() => this.house().isRinging);

  goHouse () {
    this.currentHouseService.loadHouseById(this.house().id);
    this.router.navigate(['/dashboard', 'hub']);
  }
}
