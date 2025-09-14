import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  imports: [ToggleSwitchModule, CardModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent {
  // darkMode = signal<boolean>(false);

  // ngOnInit () {
  //   // Load saved theme preference from localStorage
  //   const savedTheme = localStorage.getItem('theme');
  //   this.darkMode.set(savedTheme === 'dark');
  //   this.applyTheme();
  // }

  // onThemeToggle () {
  //   this.darkMode.update(current => !current);
  //   this.applyTheme();
  //   // Save preference to localStorage
  //   localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
  // }

  // private applyTheme () {
  //   const htmlElement = document.documentElement;
  //   if (this.darkMode()) {
  //     htmlElement.classList.add('dark');
  //   } else {
  //     htmlElement.classList.remove('dark');
  //   }
  // }
}
