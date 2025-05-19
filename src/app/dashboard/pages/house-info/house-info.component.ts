import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BtnEditCardComponent, ModalHouseComponent } from '../../components';
import { HouseProp } from '../../interfaces';

@Component({
  selector: 'app-house-info',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, ModalHouseComponent],
  templateUrl: './house-info.component.html',
  styleUrl: './house-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseInfoComponent {
  visible = false;
  houseProp!: HouseProp;
  propValue?: string;
  houseName = 'CASA PRINCIPAL';
  street = 'Av. Ayacucho';
  number = '9999';
  city = 'Rosario';
  numberSensors = 10;

  showDialog (prop: HouseProp) {
    this.visible = true;
    this.houseProp = prop;

    switch (prop) {
      case 'houseName':
        this.propValue = this.houseName;
        break;
      case 'street':
        this.propValue = this.street;
        break;
      case 'number':
        this.propValue = this.number;
        break;
      case 'city':
        this.propValue = this.city;
        break;
    }
  }

  closeDialog () {
    this.visible = false;
  }
}
