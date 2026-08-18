import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  describe('sin un tema guardado', () => {
    beforeEach(() => {
      localStorage.clear();
      document.documentElement.classList.remove('my-app-dark');

      TestBed.configureTestingModule({
        providers: [ThemeService]
      });

      service = TestBed.inject(ThemeService);
    });

    it('debería iniciar con el tema claro', () => {
      expect(service.isDarkTheme()).toBe(false);
      expect(localStorage.getItem('color-theme')).toBe('light');
      expect(document.documentElement.classList).not.toContain('my-app-dark');
    });

    it('debería aplicar y guardar el tema oscuro', () => {
      service.applyTheme('dark');

      expect(service.isDarkTheme()).toBe(true);
      expect(localStorage.getItem('color-theme')).toBe('dark');
      expect(document.documentElement.classList).toContain('my-app-dark');
    });

    it('debería aplicar y guardar el tema claro', () => {
      service.applyTheme('dark');
      service.applyTheme('light');

      expect(service.isDarkTheme()).toBe(false);
      expect(localStorage.getItem('color-theme')).toBe('light');
      expect(document.documentElement.classList).not.toContain('my-app-dark');
    });
  });

  describe('con el tema oscuro guardado', () => {
    beforeEach(() => {
      localStorage.setItem('color-theme', 'dark');
      document.documentElement.classList.remove('my-app-dark');

      TestBed.configureTestingModule({
        providers: [ThemeService]
      });
      
      service = TestBed.inject(ThemeService);
    });

    it('debería iniciar con el tema oscuro', () => {
      expect(service.isDarkTheme()).toBe(true);
      expect(document.documentElement.classList).toContain('my-app-dark');
    });
  });
});
