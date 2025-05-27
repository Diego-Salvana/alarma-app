import { ChangeDetectionStrategy, Component, effect, input, model, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ProfileProp, ModalDataTransfer } from '../../../interfaces';

@Component({
  selector: 'app-modal-profile',
  imports: [DialogModule, ButtonModule, InputTextModule, PasswordModule, InputMaskModule, ReactiveFormsModule],
  templateUrl: './modal-profile.component.html',
  styleUrl: './modal-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalProfileComponent {
  visible = model<boolean>(false);
  submitEnd = input.required();
  profileProp = input.required<ProfileProp>();
  propValue = input<string>();
  changeValue = output<ModalDataTransfer>();
  closable = signal(true);
  formControl = new FormControl('', [Validators.required]);

  constructor () {
    effect(() => (this.formControl.setValue(this.propValue() ?? '')));
    effect(() => (this.submitEnd() ? this.formControl.enable() : this.formControl.disable()));
  }

  onSubmit () {
    if (this.formControl.invalid) return;

    const data: ModalDataTransfer = { [this.profileProp()]: this.formControl.value };
    this.changeValue.emit(data);
  }
  
  close () {
    this.visible.set(false);
  }
}
