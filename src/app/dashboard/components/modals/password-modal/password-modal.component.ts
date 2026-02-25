import { ChangeDetectionStrategy, Component, effect, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { markAllAsDirtyAndTouched, passwordMatchValidator } from '../../../../auth/utils';
import { NewPassword } from '../../../../shared/interfaces';

@Component({
  selector: 'app-password-modal',
  imports: [DialogModule, ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  visible = model<boolean>(false);
  isSubmitted = input.required<boolean>();
  onSave = output<NewPassword>();
  passForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(3)]],
    newPassword: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', [passwordMatchValidator]]
  });

  constructor () {
    effect(() => {
      const isSubmitted = this.isSubmitted();

      if (isSubmitted) {
        this.close();
        this.passForm.reset();
      };
    });
  }

  ngOnInit () {
    this.passForm.controls.newPassword.valueChanges.subscribe(() => {
      const confirmPassword = this.passForm.controls.confirmPassword;
      
      confirmPassword.setValue(confirmPassword.value);
    });
  }

  onSubmit () {
    markAllAsDirtyAndTouched(this.passForm);
    
    if (this.passForm.invalid) return;
    
    const values = this.passForm.getRawValue();
    const data: NewPassword = {
      currentPassword: values.currentPassword ?? '',
      newPassword: values.newPassword ?? ''
    };

    this.onSave.emit(data);
  }

  close () {
    this.visible.set(false);
  }
}
