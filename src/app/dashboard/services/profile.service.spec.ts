import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ProfileResponse, State, User } from '../../shared/interfaces';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpTestingController: HttpTestingController;

  const apiUrl = 'http://localhost:5200/api-alarma/users';
  const profileResponse: ProfileResponse = {
    _id: 'user-1',
    nombre: 'Ana',
    apellido: 'Perez',
    nombreUsuario: 'ana.perez',
    email: 'ana@example.com',
    telefono: '1122334455',
    habilitado: true,
    casas: [{
      _id: 'house-1',
      nombre: 'Casa principal',
      nombreCasa: 'Mi hogar',
      direccion: { calle: 'Siempre Viva', numero: '742', ciudad: 'Springfield' },
      alarmaEncendida: State.OFF
    }]
  };
  const expectedUser: User = {
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
      houseName: 'Mi hogar',
      address: { street: 'Siempre Viva', number: '742', city: 'Springfield' },
      alarmState: State.OFF,
      isRinging: false,
      sensors: []
    }]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería obtener y mapear el perfil del usuario', () => {
    let user: User | undefined;

    service.getUser().subscribe(response => {
      user = response;
    });

    const request = httpTestingController.expectOne({
      url: apiUrl,
      method: 'GET'
    });
    request.flush({ message: 'Perfil obtenido', data: profileResponse });

    expect(user).toEqual(expectedUser);
  });

  it('debería propagar el error al obtener el perfil del usuario', () => {
    let errorStatus: HttpErrorResponse | undefined;

    service.getUser().subscribe({
      error: error => {
        errorStatus = error;
      }
    });

    const request = httpTestingController.expectOne({
      url: apiUrl,
      method: 'GET'
    });
    request.flush(
      { message: 'No autorizado' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(errorStatus?.status).toBe(401);
  });

  it('debería actualizar los datos del perfil con los campos traducidos', () => {
    const dataMock = { name: 'Ana', lastname: 'Perez', phone: '1122334455' };
    const bodyMock = { nombre: 'Ana', apellido: 'Perez', telefono: '1122334455' };
    let user: User | undefined;

    service.modifyUserData(dataMock).subscribe(response => {
      user = response;
    });

    const request = httpTestingController.expectOne({
      url: apiUrl,
      method: 'PATCH'
    });
    expect(request.request.body).toEqual(bodyMock);
    request.flush({ message: 'Perfil actualizado', data: profileResponse });

    expect(user).toEqual(expectedUser);
  });

  it('debería actualizar la contraseña con el cuerpo esperado', () => {
    const dataPasswordMock = { currentPassword: 'actual123', newPassword: 'nueva456' };
    const bodyPasswordMock = { contrasenaActual: 'actual123', nuevaContrasena: 'nueva456' };
    let user: User | undefined;

    service.updateUserPassword(dataPasswordMock).subscribe(response => {
      user = response;
    });

    const request = httpTestingController.expectOne({
      url: apiUrl,
      method: 'PATCH'
    });
    expect(request.request.body).toEqual(bodyPasswordMock);
    request.flush({ message: 'Contraseña actualizada', data: profileResponse });

    expect(user).toEqual(expectedUser);
  });
});
