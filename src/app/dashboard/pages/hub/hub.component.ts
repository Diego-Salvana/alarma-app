import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent } from '../../components/sensor-list/sensor-list.component';
import { ModalExclusionComponent } from '../../components/modals/modal-exclusion/modal-exclusion.component';

@Component({
  selector: 'app-hub',
  imports: [ButtonModule, SensorListComponent, ModalExclusionComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent {
  visible = false;

  showDialog () {
    this.visible = true;
  }
  
  closeDialog () {
    this.visible = false;
  }
}
