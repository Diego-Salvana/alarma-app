import { TitleCasePipe, UpperCasePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SensorListComponent, ModalExclusionComponent, ExclusionFromValue } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse, Sensor } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { ConfirmDisarmComponent } from '../../components/modals/confirm-disarm/confirm-disarm.component';

@Component({
  selector: 'app-hub',
  imports: [UpperCasePipe, TitleCasePipe, NgClass, ButtonModule, SensorListComponent, ModalExclusionComponent, ConfirmDisarmComponent],
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
  sensors = computed<Sensor[]>(() => this.house()?.sensores ?? []);
  submitEnd = signal(true);
  visible = false;
  showConfirmDisarm = signal(false);
  disarmEnd = signal(true);

  ngOnInit () {
    this.houseService.getHouse(true).subscribe({
      next: houseResponse => {
        this.house.set(houseResponse);
      },
      error: e => {
        const message = typeof e.message === 'string' ? e.message : e.error.message;
        this.toastService.error(message);
        this.noHouse.set(true);
      }
    });
  }

  activeAlarm (value: ExclusionFromValue) {
    this.submitEnd.set(false);
    
    const exclusionArray = Object.entries(value).map(([numeroSensor, estado]) => ({ numeroSensor, estado }));

    this.houseService.activeAlarm(exclusionArray).subscribe({
      next: houseResponse => {
        this.house.set(houseResponse);
        this.submitEnd.set(true);
        this.visible = false;
      },
      error: e => {
        this.toastService.error(e.error.message);
        this.submitEnd.set(true);
        this.visible = false;
      }
    });
  }

  showDialog () {
    if (this.isActivated()) {
      this.toastService.info('La alarma ya está activada.');
      return;
    }

    this.visible = true;
  }
  
  closeDialog () {
    this.visible = false;
  }

  showDisarmConfirmation () {
    if (!this.isActivated()) {
      this.toastService.info('La alarma se encuentra desactivada.');
      return;
    }
    
    this.showConfirmDisarm.set(true);
  }

  closeDisarmConfirmation (disarm: boolean) {
    if (!disarm) {
      this.showConfirmDisarm.set(false);
    } else {
      this.disarmEnd.set(false);

      this.houseService.disarmAlarm().subscribe({
        next: houseResponse => {
          this.house.set(houseResponse);
          this.disarmEnd.set(true);
          this.showConfirmDisarm.set(false);
        },
        error: e => {
          this.toastService.error(e.error.message);
          this.disarmEnd.set(true);
          this.showConfirmDisarm.set(false);
        }
      });
    }
  }
}
