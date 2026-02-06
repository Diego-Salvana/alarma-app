import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services';
import { ToastService } from '../../../shared/services';
import { finalize } from 'rxjs';
import { SendEmailFormComponent } from '../../components';

@Component({
  selector: 'app-send-verification-email',
  imports: [SendEmailFormComponent],
  templateUrl: './send-verification-email.component.html',
  styleUrl: './send-verification-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendVerificationEmailComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  isSubmitting = signal(false);
  
  sendVerificationEmail (email: string) {
    this.isSubmitting.set(true);
    this.authService
      .sendVerificationEmail(email)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.toastService.info('Revisa tu correo para verificar tu cuenta'),
        error: err => this.toastService.error(err.error.message)
      });
  }
}
