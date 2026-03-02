import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [ButtonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent implements OnInit {
  private authService = inject(AuthService);
  token = input<string>();
  isLoading = signal(true);
  successful = signal(false);
  errorMessage = signal('');

  ngOnInit () {
    const token = this.token();
    if (!token) return;

    setTimeout(() => this.sendVerification(token), 1000);
  }

  private sendVerification (token: string) {
    this.authService
      .verifyEmail(token)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: _ => this.successful.set(true),
        error: err => this.errorMessage.set(err.error.message)
      });
  }
}
