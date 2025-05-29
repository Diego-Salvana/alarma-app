import { ChangeDetectionStrategy, Component, computed, effect, input, model, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { HouseProp, ModalDataTransfer } from '../../../interfaces';

@Component({
  selector: 'app-modal-house',
  imports: [DialogModule, ButtonModule, InputTextModule, InputMaskModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './modal-house.component.html',
  styleUrl: './modal-house.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalHouseComponent {
  visible = model(false);
  submitEnd = input.required<boolean>();
  houseProp = input.required<HouseProp>();
  headerText = computed(() => this.houseProp() === 'sensorName' ? 'Datos de sensor' : 'Datos del sitio');
  propValue = input<string>();
  formControl = new FormControl('', [Validators.required]);
  changeValue = output<ModalDataTransfer>();

  constructor () {
    effect(() => (this.formControl.setValue(this.propValue() ?? '')));
    effect(() => (this.submitEnd() ? this.formControl.enable() : this.formControl.disable()));
  }

  onSubmit () {
    if (this.formControl.invalid) return;

    const data: ModalDataTransfer = { [this.houseProp()]: this.formControl.value };
    this.changeValue.emit(data);
  }

  close () {
    this.visible.set(false);
  }
}
