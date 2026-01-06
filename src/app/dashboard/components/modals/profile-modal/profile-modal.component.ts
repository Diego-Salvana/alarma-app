import { ChangeDetectionStrategy, Component, effect, input, model, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ProfileProp, ModalDataTransfer } from '../../../interfaces';

@Component({
  selector: 'app-profile-modal',
  imports: [DialogModule, ButtonModule, InputTextModule, PasswordModule, InputMaskModule, ReactiveFormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileModalComponent {
  visible = model<boolean>(false);
  submitted = input.required();
  profileProp = input.required<ProfileProp>();
  propValue = input.required<string>();
  changeValue = output<ModalDataTransfer>();
  formControl = new FormControl('', [Validators.required]);

  constructor () {
    effect(() => (this.formControl.setValue(this.propValue())));
    effect(() => (this.submitted() ? this.formControl.enable() : this.formControl.disable()));
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
