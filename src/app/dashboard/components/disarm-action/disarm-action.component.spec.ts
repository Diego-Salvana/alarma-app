import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastService } from '../../../shared/services';
import { ConfirmDialogComponent } from '../modals';
import { DisarmActionComponent } from './disarm-action.component';

describe('Componente DisarmAction', () => {
  const toastServiceMock = {
    info: vi.fn()
  };

  let fixture: ComponentFixture<DisarmActionComponent>;
  let component: DisarmActionComponent;
  let element: HTMLElement;

  beforeEach(() => {
    toastServiceMock.info.mockReset();

    TestBed.configureTestingModule({
      imports: [DisarmActionComponent],
      providers: [{ provide: ToastService, useValue: toastServiceMock }]
    });

    fixture = TestBed.createComponent(DisarmActionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
  });

  it('debería abrir el diálogo de confirmación al pulsar desactivar con la alarma activada', () => {
    fixture.componentRef.setInput('isAlarmArmed', true);
    fixture.componentRef.setInput('isSubmitted', false);
    fixture.detectChanges();

    const button = element.querySelector('#disarm-btn button') as HTMLButtonElement;
    button.click();

    expect(component.isModalVisible()).toBe(true);
    expect(toastServiceMock.info).not.toHaveBeenCalled();
  });

  it('debería informar que la alarma ya está desactivada al pulsar desactivar', () => {
    fixture.componentRef.setInput('isAlarmArmed', false);
    fixture.componentRef.setInput('isSubmitted', false);
    fixture.detectChanges();

    const button = element.querySelector('#disarm-btn button') as HTMLButtonElement;
    button.click();

    expect(component.isModalVisible()).toBe(false);
    expect(toastServiceMock.info).toHaveBeenCalledWith('La alarma se encuentra desactivada');
  });

  it('debería cerrar el diálogo al cancelar la desactivación', () => {
    fixture.componentRef.setInput('isAlarmArmed', true);
    fixture.componentRef.setInput('isSubmitted', false);
    fixture.detectChanges();
    component.isModalVisible.set(true);

    const dialog = fixture.debugElement.query(By.directive(ConfirmDialogComponent)).componentInstance as ConfirmDialogComponent;
    dialog.onReject();

    expect(component.isModalVisible()).toBe(false);
  });

  it('debería solicitar la desactivación al confirmarla en el diálogo', () => {
    fixture.componentRef.setInput('isAlarmArmed', true);
    fixture.componentRef.setInput('isSubmitted', false);
    fixture.detectChanges();
    const disarmRequestedMock = vi.fn();
    component.disarmRequested.subscribe(disarmRequestedMock);

    const dialog = fixture.debugElement.query(By.directive(ConfirmDialogComponent)).componentInstance as ConfirmDialogComponent;
    dialog.onAccept();

    expect(disarmRequestedMock).toHaveBeenCalledTimes(1);
  });
});
