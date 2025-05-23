import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Estado, Sensor } from '../../../../shared/interfaces';

@Component({
  selector: 'app-modal-exclusion',
  imports: [ButtonModule, DialogModule, TableModule, ToggleSwitchModule, ReactiveFormsModule],
  templateUrl: './modal-exclusion.component.html',
  styleUrl: './modal-exclusion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalExclusionComponent {
  visible = model<boolean>(false);
  disabled = signal(false);
  closable = signal(true);
  sensors = input.required<Sensor[]>();
  exclusionForm = computed<FormGroup>(() => {
    return this.sensors().reduce((form, sensor) => {
      form.addControl(sensor.numeroSensor.toString(), new FormControl(Estado.ENCENDIDO));
      return form;
    }, new FormGroup({}));
  });

  onSubmit () {
    console.log('Exclusión: ', this.exclusionForm().value);
    this.disabled.set(true);
    this.closable.set(false);
    this.exclusionForm().disable();
    
    // TODO: realizar petición
    setTimeout(() => {
      this.disabled.set(false);
      this.closable.set(true);
      this.exclusionForm().enable();
      this.close();
    }, 1000);
  }

  close () {
    this.visible.set(false);
  }
}
