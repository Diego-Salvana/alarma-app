import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailComponent implements OnInit {
  private authService = inject(AuthService);
  token = input<string>();
  successful = signal(false);

  ngOnInit () {
    const token = this.token();
    if (!token) return;

    this.authService.verifyEmail(token).subscribe({
      next: data => {
        this.successful.set(true);
        console.log(data);
      },
      error: err => {
        this.successful.set(false);
        console.log(err);
      }
    });
  }
}
