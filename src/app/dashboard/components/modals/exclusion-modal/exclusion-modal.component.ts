import { ChangeDetectionStrategy, Component, computed, effect, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ExclusionFormValues, Sensor, State } from '../../../../shared/interfaces';

@Component({
  selector: 'app-exclusion-modal',
  imports: [ButtonModule, DialogModule, TableModule, ToggleSwitchModule, ReactiveFormsModule],
  templateUrl: './exclusion-modal.component.html',
  styleUrl: './exclusion-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExclusionModalComponent {
  visible = model<boolean>(false);
  submitEnd = input.required<boolean>();
  sensors = input.required<Sensor[]>();
  onActive = output<ExclusionFormValues>();
  exclusionForm = computed<FormGroup<{ [key: string]: FormControl<State> }>>(() => {
    return this.sensors().reduce((form, sensor) => {
      form.addControl(sensor.number.toString(), new FormControl(State.ON));
      return form;
    }, new FormGroup({}));
  });

  constructor () {
    effect(() => this.submitEnd() ? this.exclusionForm().enable() : this.exclusionForm().disable());
  }

  onSubmit () {
    this.onActive.emit(this.exclusionForm().value);
  }

  close () {
    this.visible.set(false);
  }
}
