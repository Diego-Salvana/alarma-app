import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
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
  disabled = signal(false);
  closable = signal(true);
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
  
    this.disabled.set(true);
    this.closable.set(false);
  
    const data: ModalDataTransfer = { newPassword: this.passForm.controls.newPassword.value };
  
    console.log('Data transfer', data);
  
    // TODO: realizar petición
    setTimeout(() => {
      this.disabled.set(false);
      this.closable.set(true);
      this.close();
    }, 1000);
  }

  close () {
    this.visible.set(false);
  }
}
