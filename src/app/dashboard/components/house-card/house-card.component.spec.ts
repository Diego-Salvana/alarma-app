import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { House, State } from '../../../shared/interfaces';
import { CurrentHouseService } from '../../services';
import { HouseCardComponent } from './house-card.component';

describe('Componente HouseCard', () => {
  const currentHouseServiceMock = {
    loadHouseById: vi.fn()
  };
  const routerMock = {
    navigate: vi.fn()
  };

  const house: House = {
    id: 'house-1',
    displayName: 'Casa principal',
    houseName: 'casa-principal',
    address: {
      street: 'Calle 10',
      number: '123',
      city: 'Buenos Aires'
    },
    alarmState: State.ON,
    isRinging: false,
    sensors: []
  };

  let fixture: ComponentFixture<HouseCardComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    currentHouseServiceMock.loadHouseById.mockReset();
    routerMock.navigate.mockReset();

    TestBed.configureTestingModule({
      imports: [HouseCardComponent],
      providers: [
        { provide: CurrentHouseService, useValue: currentHouseServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    fixture = TestBed.createComponent(HouseCardComponent);
    element = fixture.nativeElement as HTMLElement;
  });

  it('debería mostrar los datos y el estado activado de la casa', () => {
    fixture.componentRef.setInput('house', house);
    fixture.detectChanges();

    const homeIcon = element.querySelector('.pi-home') as HTMLElement;
    const status = element.querySelector('p') as HTMLParagraphElement;

    expect(element.textContent).toContain('CASA PRINCIPAL');
    expect(element.textContent).toContain('Calle 10 123');
    expect(status.textContent?.trim()).toBe('Activada');
    expect(homeIcon.classList).toContain('red-text');
    expect(status.classList).toContain('red-text');
  });

  it('debería mostrar el estado desactivado y sus clases visuales', () => {
    fixture.componentRef.setInput('house', { ...house, alarmState: State.OFF });
    fixture.detectChanges();

    const homeIcon = element.querySelector('.pi-home') as HTMLElement;
    const ringingIcon = element.querySelector('.pi-volume-up') as HTMLElement;
    const status = element.querySelector('p') as HTMLParagraphElement;

    expect(status.textContent?.trim()).toBe('Desactivada');
    expect(homeIcon.classList).toContain('green-text');
    expect(status.classList).toContain('green-text');
    expect(ringingIcon.classList).toContain('orange-text');
    expect(ringingIcon.classList).not.toContain('pulse-animation');
  });

  it('debería animar el icono de sirena cuando la alarma está sonando', () => {
    fixture.componentRef.setInput('house', { ...house, isRinging: true });
    fixture.detectChanges();

    const ringingIcon = element.querySelector('.pi-volume-up') as HTMLElement;

    expect(ringingIcon.classList).toContain('pulse-animation');
  });

  it('debería cargar la casa y navegar al hub al pulsar la tarjeta', () => {
    fixture.componentRef.setInput('house', house);
    fixture.detectChanges();

    const card = element.querySelector('p-card') as HTMLElement;
    card.click();

    expect(currentHouseServiceMock.loadHouseById).toHaveBeenCalledWith(house.id);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard', 'hub']);
  });
});
