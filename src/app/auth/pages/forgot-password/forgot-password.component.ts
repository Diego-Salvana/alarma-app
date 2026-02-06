import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services';

@Component({
  selector: 'app-forgot-password',
  imports: [Button, InputTextModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  isSubmitting = signal(false);

  onSubmit (form: NgForm) {
    if (form.invalid) return;
    
    this.isSubmitting.set(true);
    this.authService
      .forgotPassword(form.value.email)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.toastService.info('Revisa tu correo para restablecer la contraseña'),
        error: err => this.toastService.error(err.error.message)
      });
  }
}
