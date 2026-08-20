import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppComponent } from './app.component';
import { ThemeService } from './shared/services';

describe('AppComponent', () => {
  const themeService = {
    applyTheme: vi.fn()
  };

  let fixture: ComponentFixture<AppComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ThemeService, useValue: themeService }
      ],
      imports: [AppComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
  });

  it('debería iniciar el componente', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
