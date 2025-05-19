import { ChangeDetectionStrategy, Component, computed, effect, input, model, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { HouseProp, DataTransfer } from '../../../interfaces/modals.interfaces';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-house',
  imports: [DialogModule, ButtonModule, InputTextModule, InputMaskModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './modal-house.component.html',
  styleUrl: './modal-house.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalHouseComponent {
  visible = model<boolean>(false);
  houseProp = input.required<HouseProp>();
  headerText = computed(() => this.houseProp() === 'sensorName' ? 'Datos de sensor' : 'Datos del sitio');
  propValue = input<string>();
  disabled = signal(false);
  closable = signal(true);
  formControl!: FormControl;
  private ef = effect(() => (this.formControl = new FormControl(this.propValue(), [Validators.required])));

  onSubmit () {
    if (this.formControl.invalid) return;

    this.disabled.set(true);
    this.closable.set(false);

    const data: DataTransfer = { [this.houseProp()]: this.formControl.value };

    console.log('Data transfer', data);

    // TODO: realizar petición
    setTimeout(() => {
      this.disabled.set(false);
      this.closable.set(true);
      this.close();
    }, 1000);
  }

  close () {
    this.visible.set(false);
  }
}
