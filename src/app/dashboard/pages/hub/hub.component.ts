import { TitleCasePipe, UpperCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, ModalExclusionComponent } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse, Sensor } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-hub',
  imports: [UpperCasePipe, TitleCasePipe, NgClass, ButtonModule, SensorListComponent, ModalExclusionComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubComponent implements OnInit {
  private houseService = inject(HouseService);
  private toastService = inject(ToastService);
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
        const message = typeof e.message === 'string' ? e.message : e.error.message;
        this.toastService.error(message);
        this.noHouse.set(true);
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
