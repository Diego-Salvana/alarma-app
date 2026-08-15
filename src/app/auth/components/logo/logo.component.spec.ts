import { TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LogoComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [LogoComponent]
    });
  });

  it('debería renderizar el logo del tema claro', () => {
    const fixture = TestBed.createComponent(LogoComponent);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe('/assets/icono-login.png');
  });
});
