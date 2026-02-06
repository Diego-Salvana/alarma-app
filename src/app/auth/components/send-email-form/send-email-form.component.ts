import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-send-email-form',
  imports: [ButtonModule, FormsModule, InputTextModule],
  templateUrl: './send-email-form.component.html',
  styleUrl: './send-email-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendEmailFormComponent {
  isSubmitting = input.required<boolean>();
  onSubmit = output<string>();

  onFormSubmit (form: NgForm) {
    if (form.invalid) return;

    this.onSubmit.emit(form.value.email);
  }
}
