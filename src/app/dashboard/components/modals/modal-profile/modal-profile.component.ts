import { ChangeDetectionStrategy, Component, effect, input, model, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ProfileProp, DataTransfer } from '../../../interfaces/modals.interfaces';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-profile',
  imports: [DialogModule, ButtonModule, InputTextModule, PasswordModule, InputMaskModule, ReactiveFormsModule],
  templateUrl: './modal-profile.component.html',
  styleUrl: './modal-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalProfileComponent {
  visible = model<boolean>(false);
  profileProp = input.required<ProfileProp>();
  propValue = input<string>();
  disabled = signal(false);
  closable = signal(true);
  formControl!: FormControl;
  private ef = effect(() => (this.formControl = new FormControl(this.propValue(), [Validators.required])));

  onSubmit () {
    if (this.formControl.invalid) return;

    this.disabled.set(true);
    this.closable.set(false);

    const data: DataTransfer = { [this.profileProp()]: this.formControl.value };

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
