import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { HouseProp } from '../../../interfaces/modals.interfaces';

@Component({
  selector: 'app-modal-house',
  imports: [DialogModule, ButtonModule, InputTextModule, InputMaskModule, PasswordModule],
  templateUrl: './modal-house.component.html',
  styleUrl: './modal-house.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalHouseComponent {
  visible = model<boolean>(false);
  houseProp = input<HouseProp>();
  headerText = computed(() => this.houseProp() === 'sensorName' ? 'Datos de sensor' : 'Datos del sitio');

  close () {
    this.visible.set(false);
  }
}
