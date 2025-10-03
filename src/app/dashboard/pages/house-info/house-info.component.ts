import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BtnEditCardComponent, ModalHouseComponent } from '../../components';
import { HouseProp, ModalDataTransfer } from '../../interfaces';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-house-info',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, ModalHouseComponent, TitleCasePipe],
  templateUrl: './house-info.component.html',
  styleUrl: './house-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseInfoComponent {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  loading = signal(true);
  house = signal<HouseResponse | null>(null);
  submitCompleted = signal(true);
  houseModalOpen = signal(false);
  houseProp!: HouseProp;
  propValue?: string;

  constructor () {
    this.houseService.getHouseInfo()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: house => {
          this.house.set(house);
          this.loading.set(false);
        },
        error: e => {
          const message = typeof e.message === 'string' ? e.message : e.error.message;
          this.toastService.error(message);
          this.loading.set(false);
        }
      });
  }

  /** Actualiza datos de una casa. */
  updateHouse (data: ModalDataTransfer) {
    this.submitCompleted.set(false);
        
    this.houseService.modifyHouse(data).subscribe({
      next: house => {
        this.house.set(house);
        this.submitCompleted.set(true);
        this.houseModalOpen.set(false);
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitCompleted.set(true);
        this.houseModalOpen.set(false);
      }
    });
  }

  /** Abre una modal de edición según la propiedad de la casa. */
  showDialog (prop: HouseProp) {
    this.houseModalOpen.set(true);
    this.houseProp = prop;

    switch (prop) {
      case 'houseName':
        this.propValue = this.house()?.nombre;
        break;
      case 'street':
        this.propValue = this.house()?.direccion.calle;
        break;
      case 'number':
        this.propValue = this.house()?.direccion.numero.toString();
        break;
      case 'city':
        this.propValue = this.house()?.direccion.ciudad;
        break;
    }
  }

  /** Cierra modal de edición. */
  closeDialog () {
    this.houseModalOpen.set(false);
  }
}
