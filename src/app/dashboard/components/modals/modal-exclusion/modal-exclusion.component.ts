import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Sensor } from '../../../interfaces';

@Component({
  selector: 'app-modal-exclusion',
  imports: [CommonModule, ButtonModule, DialogModule, TableModule, ToggleSwitchModule, ReactiveFormsModule],
  templateUrl: './modal-exclusion.component.html',
  styleUrl: './modal-exclusion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalExclusionComponent implements OnInit {
  visible = model<boolean>(false);
  disabled = signal(false);
  closable = signal(true);
  sensors = input.required<Sensor[]>();
  exclusionForm = new FormGroup<{ [key: string]: FormControl }>({});

  ngOnInit () {
    this.sensors().forEach(sensor => {
      this.exclusionForm.addControl(sensor.id.toString(), new FormControl(sensor.estado));
    });
  }

  onSubmit () {
    console.log('Exclusión: ', this.exclusionForm.value);
    this.disabled.set(true);
    this.closable.set(false);
    this.exclusionForm.disable();
    
    // TODO: realizar petición
    setTimeout(() => {
      this.disabled.set(false);
      this.closable.set(true);
      this.exclusionForm.enable();
      this.close();
    }, 1000);
  }

  close () {
    this.visible.set(false);
  }
}
