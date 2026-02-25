import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DetailsCardComponent, SecurityCardComponent } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse, HouseUpdate, NewCode, State } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-house-info',
  imports: [CardModule, ButtonModule, TitleCasePipe, SecurityCardComponent, DetailsCardComponent],
  templateUrl: './house-info.component.html',
  styleUrl: './house-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseInfoComponent {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  house = signal<HouseResponse | null>(null);
  isAlarmArmed = computed(() => this.house()?.alarmaEncendida === State.ON);
  isLoading = signal(true);
  isSubmitted = signal(true);

  constructor () {
    this.houseService
      .getHouseInfo()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: house => this.house.set(house),
        error: err => this.toastService.error(err.error?.message ?? 'Error al obtener la casa')
      });
  }

  /** Actualiza códgigo de activación de una casa. */
  updateCode (data: NewCode) {
    this.isSubmitted.set(false);
        
    this.houseService
      .updateAlarmCode(data)
      .pipe(finalize(() => this.isSubmitted.set(true)))
      .subscribe({
        next: _ => this.toastService.info('Código actualizado'),
        error: err => this.toastService.error(err.error.message)
      });
  }

  /** Actualiza información de una casa. */
  udpdateHouseInfo (data: HouseUpdate) {
    this.isSubmitted.set(false);

    this.houseService.updateHouseInfo(data)
      .pipe(finalize(() => this.isSubmitted.set(true)))
      .subscribe({
        next: houseResponse => this.house.set(houseResponse),
        error: err => this.toastService.error(err.error.message)
      });
  }
}
