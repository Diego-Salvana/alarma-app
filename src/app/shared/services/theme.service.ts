import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private darkTheme = signal(false);
  isDarkTheme = this.darkTheme.asReadonly();

  constructor () {
    const theme = localStorage.getItem('color-theme');
    this.applyTheme(theme === 'dark' ? 'dark' : 'light');
  }

  applyTheme (theme: 'light' | 'dark') {
    this.darkTheme.set(theme === 'dark');
    localStorage.setItem('color-theme', theme);

    if (theme === 'dark') {
      this.document.documentElement.classList.add('my-app-dark');
    } else {
      this.document.documentElement.classList.remove('my-app-dark');
    }
  }
}
