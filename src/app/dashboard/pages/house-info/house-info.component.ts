import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BtnEditCardComponent } from '../../components/btn-edit-card/btn-edit-card.component';
import { ModalHouseComponent } from '../../components/modals/modal-house/modal-house.component';
import { HouseProp } from '../../interfaces/modals.interfaces';

@Component({
  selector: 'app-house-info',
  imports: [CardModule, ButtonModule, BtnEditCardComponent, ModalHouseComponent],
  templateUrl: './house-info.component.html',
  styleUrl: './house-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseInfoComponent {
  visible = false;
  houseProp?: HouseProp;

  showDialog (prop: HouseProp) {
    this.visible = true;

    switch (prop) {
      case 'name':
        this.houseProp = 'name';
        break;
      case 'street':
        this.houseProp = 'street';
        break;
      case 'number':
        this.houseProp = 'number';
        break;
      case 'city':
        this.houseProp = 'city';
        break;
      default:
        break;
    }
  }

  closeDialog () {
    this.visible = false;
  }
}
