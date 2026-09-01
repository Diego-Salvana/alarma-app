import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LogoComponent', () => {
  let fixture: ComponentFixture<LogoComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [LogoComponent]
    });
    
    fixture = TestBed.createComponent(LogoComponent);
    element = fixture.nativeElement;
  });

  it('debería renderizar el logo del tema claro', () => {
    fixture.detectChanges();

    const image = element.querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe('/assets/icono-login.png');
  });
});
