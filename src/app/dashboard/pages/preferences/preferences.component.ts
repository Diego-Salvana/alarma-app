import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { SocketService, ThemeService, ToastService } from '../../../shared/services';
import { State } from '../../../shared/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentHouseService, CurrentUserService } from '../../services';
import { WS_LIGHTS } from '../../../shared/constants';
import { Lights } from '../../interfaces';

@Component({
  selector: 'app-preferences',
  imports: [ToggleSwitchModule, CardModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent {
  private themeService = inject(ThemeService);
  private socketService = inject(SocketService);
  private currentHouseService = inject(CurrentHouseService);
  private userService = inject(CurrentUserService);
  private toastService = inject(ToastService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  readonly darkMode = this.themeService.isDarkTheme();
  readonly username = this.userService.username;
  readonly house = this.currentHouseService.house;
  lightsOn = false;

  constructor () {
    const lightsState = localStorage.getItem('lightsState');
    
    if (lightsState) {
      this.lightsOn = lightsState === State.ON;
    }

    this.socketService
      .on<Lights>(`${WS_LIGHTS}/${this.username() ?? ''}/${this.house()?.displayName ?? ''}`)
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        console.log(data);
        
        this.lightsOn = data.state === State.ON;
        localStorage.setItem('lightsState', data.state);
        this.changeDetectorRef.detectChanges();
      });
  }
  
  changeLightsState (event: ToggleSwitchChangeEvent) {
    const sector = 'patio';
    const state = event.checked ? State.ON : State.OFF;

    this.currentHouseService.setLights({ sector, state }).subscribe({
      error: err => this.toastService.error(err.error.message)
    });
  }

  onThemeToggle (event: ToggleSwitchChangeEvent) {
    this.themeService.applyTheme(event.checked ? 'dark' : 'light');
  }
}
