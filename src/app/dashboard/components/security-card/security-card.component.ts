import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { PasswordModalComponent, CodeModalComponent } from '../modals';
import { NewCode, NewPassword } from '../../../shared/interfaces';

@Component({
  selector: 'app-security-card',
  imports: [CardModule, ButtonModule, NgClass, PasswordModalComponent, CodeModalComponent],
  templateUrl: './security-card.component.html',
  styleUrl: './security-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityCardComponent {
  type = input.required<'password' | 'code'>();
  title = input.required<string>();
  subtitle = input.required<string>();
  iconClass = input.required<string>();
  isAlarmArmed = input.required<boolean>();
  isSubmitted = input.required<boolean>();
  isModalOpen = signal(false);
  onSavePassword = output<NewPassword>();
  onSaveCode = output<NewCode>();

  showModal () {
    this.isModalOpen.set(true);
  }

  resetModalVisibility () {
    this.isModalOpen.set(false);
  }

  onSavePassHandler (data: NewPassword) {
    this.onSavePassword.emit(data);
  }

  onSaveCodeHandler (data: NewCode) {
    this.onSaveCode.emit(data);
  }
}
