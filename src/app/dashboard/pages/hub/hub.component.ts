import { TitleCasePipe, UpperCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SensorListComponent, ModalExclusionComponent } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../auth/interfaces';
import { Sensor } from '../../../shared/interfaces';

@Component({
  selector: 'app-hub',
  imports: [UpperCasePipe, TitleCasePipe, NgClass, ButtonModule, SensorListComponent, ModalExclusionComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent implements OnInit {
  private houseService = inject(HouseService);
  private messageService = inject(MessageService);
  house = signal<HouseResponse | null>(null);
  noHouse = signal(false);
  isActivated = computed(() => this.house()?.alarmaEncendida === 'On');
  visible = false;
  sensors = computed<Sensor[]>(() => this.house()?.sensores ?? []);

  ngOnInit () {
    this.houseService.getHouse(true).subscribe({
      next: houseResponse => {
        this.house.set(houseResponse);

        // Simulación de llegada de info desde WebSockets
        setTimeout(() => {
          // this.house.update(house => house ? { ...house, alarmaEncendida: Estado.ENCENDIDO } : null);
        }, 2000);
      },
      error: e => {
        this.noHouse.set(true);
        this.messageService.add({ severity: 'contrast', summary: 'Error', detail: e.error.message });
      }
    });
  }

  showDialog () {
    this.visible = true;
  }
  
  closeDialog () {
    this.visible = false;
  }
}
