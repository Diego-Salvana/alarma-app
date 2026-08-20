import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { MessageService } from 'primeng/api';

describe('alertas Toast', () => {
  const messageServiceMock = {
    add: vi.fn()
  };

  let service: ToastService;

  beforeEach(() => {
    messageServiceMock.add.mockReset();

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MessageService, useValue: messageServiceMock }
      ]
    });

    service = TestBed.inject(ToastService);
  });

  it('debería llamar correctamente la dependencia en caso de error', () => {
    const errorMessageMock = 'Ocurrió un error';
    const argsMock = { severity: 'contrast', summary: 'Error', detail: errorMessageMock };
    
    service.error(errorMessageMock);

    expect(messageServiceMock.add).toHaveBeenCalledTimes(1);
    expect(messageServiceMock.add).toHaveBeenCalledWith(argsMock);
  });

  it('debería llamar correctamente la dependencia en caso de información', () => {
    const infoMessageMock = 'Información importante';
    const argsMock = { severity: 'info', summary: 'Info', detail: infoMessageMock };

    service.info(infoMessageMock);

    expect(messageServiceMock.add).toHaveBeenCalledTimes(1);
    expect(messageServiceMock.add).toHaveBeenCalledWith(argsMock);
  });

  it('debería llamar correctamente la dependencia en caso de alerta', () => {
    const alertMessageMock = 'Alerta importante';
    const argsMock = { severity: 'contrast', summary: 'Alerta', detail: alertMessageMock };

    service.alert(alertMessageMock);

    expect(messageServiceMock.add).toHaveBeenCalledTimes(1);
    expect(messageServiceMock.add).toHaveBeenCalledWith(argsMock);
  });
});
