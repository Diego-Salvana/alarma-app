import { ChangeDetectionStrategy, Component, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { markAllAsDirtyAndTouched, passwordMatchValidator } from '../../../../auth/utils';
import { ModalDataTransfer } from '../../../interfaces';

@Component({
  selector: 'app-modal-password',
  imports: [DialogModule, ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './modal-password.component.html',
  styleUrl: './modal-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  visible = model<boolean>(false);
  submitEnd = input.required();
  changeValue = output<ModalDataTransfer>();
  passForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(3)]],
    newPassword: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', [passwordMatchValidator]]
  });

  ngOnInit () {
    this.passForm.controls.newPassword.valueChanges.subscribe(() => {
      const confirmPassword = this.passForm.controls.confirmPassword;
      
      confirmPassword.setValue(confirmPassword.value);
    });
  }

  onSubmit () {
    markAllAsDirtyAndTouched(this.passForm);
    
    if (this.passForm.invalid) return;
    
    const data: ModalDataTransfer = {
      password: this.passForm.controls.currentPassword.value,
      newPassword: this.passForm.controls.newPassword.value
    };

    this.changeValue.emit(data);
  }

  close () {
    this.visible.set(false);
  }
}
