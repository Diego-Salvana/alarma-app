import { ChangeDetectionStrategy, Component, computed, effect, input, model, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { HouseModalField, HouseUpdate } from '../../../../shared/interfaces';

@Component({
  selector: 'app-house-modal',
  imports: [DialogModule, ButtonModule, InputTextModule, InputMaskModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './house-modal.component.html',
  styleUrl: './house-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseModalComponent {
  visible = model(false);
  submitted = input.required<boolean>();
  houseProp = input.required<HouseModalField>();
  propValue = input.required<string>();
  formControl = new FormControl('', [Validators.required]);
  onSave = output<HouseUpdate>();
  headerText = computed(
    () => this.houseProp() === 'sensorName' ? 'Datos de sensor' : 'Datos del sitio'
  );

  constructor () {
    effect(() => this.formControl.setValue(this.propValue()));
    
    effect(() => {
      const isSubmitted = this.submitted();

      if (isSubmitted) {
        this.formControl.enable();
        this.close();
      } else {
        this.formControl.disable();
      }
    });
  }

  onSubmit () {
    if (this.formControl.invalid) return;

    const data: HouseUpdate = { [this.houseProp()]: this.formControl.value };
    this.onSave.emit(data);
  }

  close () {
    this.visible.set(false);
  }
}
