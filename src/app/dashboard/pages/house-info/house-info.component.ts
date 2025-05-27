import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BtnEditCardComponent, ModalHouseComponent } from '../../components';
import { HouseProp, ModalDataTransfer } from '../../interfaces';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-house-info',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, ModalHouseComponent, UpperCasePipe, TitleCasePipe],
  templateUrl: './house-info.component.html',
  styleUrl: './house-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseInfoComponent implements OnInit {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
  house = signal<HouseResponse | null>(null);
  noHouse = signal(false);
  submitEnd = signal(true);
  visible = false;
  houseProp!: HouseProp;
  propValue?: string;

  ngOnInit () {
    this.houseService.getInfoHouse().subscribe({
      next: house => {
        this.house.set(house);
        this.noHouse.set(false);
      },
      error: e => {
        const message = typeof e.message === 'string' ? e.message : e.error.message;
        this.toastService.error(message);
        this.noHouse.set(true);
      }
    });
  }

  onSubmit (data: ModalDataTransfer) {
    this.submitEnd.set(false);
        
    this.houseService.modifyHouse(data).subscribe({
      next: house => {
        this.house.set(house);
        this.submitEnd.set(true);
        this.visible = false;
      },
      error: e => {
        console.log(e);

        this.toastService.error(e.error.message);
        this.submitEnd.set(true);
        this.visible = false;
      }
    });
  }

  showDialog (prop: HouseProp) {
    this.visible = true;
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

  closeDialog () {
    this.visible = false;
  }
}
