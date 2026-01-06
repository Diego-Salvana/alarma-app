import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BtnEditCardComponent, HouseModalComponent } from '../../components';
import { HouseProp, ModalDataTransfer } from '../../interfaces';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-house-info',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, HouseModalComponent, TitleCasePipe],
  templateUrl: './house-info.component.html',
  styleUrl: './house-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseInfoComponent {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  house = signal<HouseResponse | null>(null);
  isLoading = signal(true);
  houseModalOpen = signal(false);
  submitted = signal(true);
  houseProp?: HouseProp;
  propValue = '';

  constructor () {
    this.houseService
      .getHouseInfo()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: house => this.house.set(house),
        error: err => this.toastService.error(err.message)
      });
  }

  /** Actualiza datos de una casa. */
  updateHouse (data: ModalDataTransfer) {
    this.submitted.set(false);
        
    this.houseService
      .modifyHouse(data)
      .pipe(
        finalize(() => {
          this.submitted.set(true);
          this.houseModalOpen.set(false);
        })
      )
      .subscribe({
        next: house => this.house.set(house),
        error: err => this.toastService.error(err.message)
      });
  }

  /** Abre una modal de edición según la propiedad de la casa. */
  showDialog (prop: HouseProp) {
    const house = this.house();
    if (!house) return;

    this.houseModalOpen.set(true);
    this.houseProp = prop;

    switch (prop) {
      case 'houseName':
        this.propValue = house.nombre;
        break;
      case 'street':
        this.propValue = house.direccion.calle;
        break;
      case 'number':
        this.propValue = house.direccion.numero.toString();
        break;
      case 'city':
        this.propValue = house.direccion.ciudad;
        break;
    }
  }

  /** Cierra modal de edición. */
  closeDialog () {
    this.houseModalOpen.set(false);
  }
}
