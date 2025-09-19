import { ChangeDetectionStrategy, Component, inject, OnInit, Signal, signal } from '@angular/core';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../shared/services';

@Component({
  selector: 'app-preferences',
  imports: [ToggleSwitchModule, CardModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent {
  private themeService = inject(ThemeService);
  darkMode = this.themeService.isDarkTheme();

  onThemeToggle (event: ToggleSwitchChangeEvent) {
    this.themeService.applyTheme(event.checked ? 'dark' : 'light');
  }
}
