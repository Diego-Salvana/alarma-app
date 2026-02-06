import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { markAllAsDirtyAndTouched, passwordMatchValidator } from '../../utils';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-reset-password',
  imports: [PasswordModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  passForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, passwordMatchValidator]]
  });

  token = input.required<string>();
  isSubmitting = signal(false);

  ngOnInit () {
    this.passForm.controls.password.valueChanges.subscribe(() => {
      const rePassControl = this.passForm.controls.confirmPassword;
      rePassControl.setValue(rePassControl.value);
    });
  }

  onSubmit () {
    markAllAsDirtyAndTouched(this.passForm);

    if (this.passForm.invalid) return;

    const pass = this.passForm.value.password;
    if (!pass) return;
    
    this.isSubmitting.set(true);
    this.authService
      .resetPassword(this.token(), pass)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard/hub'),
        error: err => this.toastService.error(err.error.message)
      });
  }
}
