import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { State, User } from '../../../shared/interfaces';
import { ToastService } from '../../../shared/services';
import { CurrentHouseService, CurrentUserService, HouseService } from '../../services';
import { ProfileService } from '../../services/profile.service';
import { ProfileComponent } from './profile.component';

describe('Componente Profile', () => {
  const profileServiceMock = {
    getUser: vi.fn(),
    modifyUserData: vi.fn(),
    updateUserPassword: vi.fn()
  };
  const currentHouseServiceMock = {
    isAlarmArmed: signal(false)
  };
  const currentUserServiceMock = {
    logout: vi.fn()
  };
  const houseServiceMock = {
    setHouseInfoID: vi.fn()
  };
  const toastServiceMock = {
    error: vi.fn(),
    info: vi.fn()
  };
  const routerMock = {
    navigate: vi.fn()
  };
  const user: User = {
    id: 'user-1',
    firstName: 'Ana',
    lastName: 'Perez',
    username: 'ana.perez',
    email: 'ana@example.com',
    phone: '1122334455',
    isEnabled: true,
    houses: [{
      id: 'house-1',
      displayName: 'Casa principal',
      houseName: 'mi-hogar',
      address: { street: 'Siempre Viva', number: '742', city: 'Springfield' },
      alarmState: State.OFF,
      isRinging: false,
      sensors: []
    }]
  };

  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;
  let element: HTMLElement;

  beforeEach(() => {
    profileServiceMock.getUser.mockReset();
    profileServiceMock.modifyUserData.mockReset();
    profileServiceMock.updateUserPassword.mockReset();
    currentUserServiceMock.logout.mockReset();
    houseServiceMock.setHouseInfoID.mockReset();
    toastServiceMock.error.mockReset();
    toastServiceMock.info.mockReset();
    routerMock.navigate.mockReset();
    currentHouseServiceMock.isAlarmArmed.set(false);
    profileServiceMock.getUser.mockReturnValue(of(user));

    TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: CurrentHouseService, useValue: currentHouseServiceMock },
        { provide: CurrentUserService, useValue: currentUserServiceMock },
        { provide: HouseService, useValue: houseServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
  });

  it('debería cargar y mostrar el perfil del usuario', () => {
    fixture.detectChanges();

    expect(profileServiceMock.getUser).toHaveBeenCalledOnce();
    expect(component.user()).toEqual(user);
    expect(component.isLoading()).toBe(false);
    expect(element.textContent).toContain('Ana Perez');
    expect(element.textContent).toContain('ana@example.com');
    expect(element.textContent).toContain('Casa principal');
  });

  it('debería informar falta de autorización al fallar la carga del perfil', () => {
    profileServiceMock.getUser.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    expect(component.user()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(toastServiceMock.error).toHaveBeenCalledWith('No estás autorizado para ver el perfil');
    expect(element.textContent).toContain('No se encontró el usuario.');
  });

  it('debería actualizar el usuario al guardar sus datos de perfil', () => {
    const updatedUser = { ...user, firstName: 'Ana Maria' };
    profileServiceMock.modifyUserData.mockReturnValue(of(updatedUser));
    fixture.detectChanges();

    component.updateProfile({ name: 'Ana Maria' });

    expect(profileServiceMock.modifyUserData).toHaveBeenCalledWith({ name: 'Ana Maria' });
    expect(component.user()).toEqual(updatedUser);
    expect(component.submitted()).toBe(true);
  });

  it('debería mostrar el error al fallar la actualización del perfil', () => {
    profileServiceMock.modifyUserData.mockReturnValue(throwError(() => {
      return { error: { message: 'Teléfono inválido' } };
    }));
    fixture.detectChanges();

    component.updateProfile({ phone: 'abc' });

    expect(toastServiceMock.error).toHaveBeenCalledWith('Teléfono inválido');
    expect(component.submitted()).toBe(true);
  });

  it('debería notificar la actualización exitosa de la contraseña', () => {
    profileServiceMock.updateUserPassword.mockReturnValue(of(user));
    const newPassDataMock = { currentPassword: 'actual123', newPassword: 'nueva456' };
    fixture.detectChanges();

    component.updatePassword(newPassDataMock);

    expect(profileServiceMock.updateUserPassword).toHaveBeenCalledWith(newPassDataMock);
    expect(toastServiceMock.info).toHaveBeenCalledWith('Contraseña actualizada correctamente');
    expect(component.submitted()).toBe(true);
  });

  it('debería guardar el "id" de la casa seleccionada y navegar a su información', () => {
    component.goToHouseInfo('house-1');

    expect(houseServiceMock.setHouseInfoID).toHaveBeenCalledWith('house-1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard', 'profile', 'house']);
  });
});
