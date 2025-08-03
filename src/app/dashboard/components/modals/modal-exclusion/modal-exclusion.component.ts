import { ChangeDetectionStrategy, Component, computed, effect, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Estado, Sensor } from '../../../../shared/interfaces';

export type ExclusionFormValue = Partial<{ [key: string]: Estado }>;

@Component({
  selector: 'app-modal-exclusion',
  imports: [ButtonModule, DialogModule, TableModule, ToggleSwitchModule, ReactiveFormsModule],
  templateUrl: './modal-exclusion.component.html',
  styleUrl: './modal-exclusion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalExclusionComponent {
  visible = model<boolean>(false);
  submitEnd = input.required<boolean>();
  onActive = output<ExclusionFormValue>();

  sensors = input.required<Sensor[]>();
  exclusionForm = computed<FormGroup<{ [key: string]: FormControl<Estado> }>>(() => {
    return this.sensors().reduce((form, sensor) => {
      form.addControl(sensor.numeroSensor.toString(), new FormControl(Estado.ENCENDIDO));
      return form;
    }, new FormGroup({}));
  });

  constructor () {
    effect(() => {
      this.submitEnd() ? this.exclusionForm().enable() : this.exclusionForm().disable();
    });
  }

  onSubmit () {
    this.onActive.emit(this.exclusionForm().value);
  }

  close () {
    this.visible.set(false);
  }
}
