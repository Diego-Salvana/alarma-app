import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-exclusion',
  imports: [ButtonModule, DialogModule, TableModule, ToggleSwitchModule, FormsModule],
  templateUrl: './modal-exclusion.component.html',
  styleUrl: './modal-exclusion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalExclusionComponent {
  visible = model<boolean>(false);
  sensors = [
    { nombre: 'Comerdor', estado: true },
    { nombre: 'Patio', estado: true },
    { nombre: 'Garage', estado: true },
    { nombre: 'Sensor 4', estado: true },
    { nombre: 'Sensor 5', estado: true },
    { nombre: 'Sensor 6', estado: true }
  ];

  close () {
    this.visible.set(false);
  }
}
