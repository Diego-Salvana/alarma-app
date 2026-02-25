import { ChangeDetectionStrategy, Component, effect, input, model, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ProfileModalField, ProfileUpdate } from '../../../../shared/interfaces';

@Component({
  selector: 'app-profile-modal',
  imports: [DialogModule, ButtonModule, InputTextModule, PasswordModule, InputMaskModule, ReactiveFormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileModalComponent {
  visible = model<boolean>(false);
  submitted = input.required<boolean>();
  profileProp = input.required<ProfileModalField>();
  propValue = input.required<string>();
  onSave = output<ProfileUpdate>();
  formControl = new FormControl('', [Validators.required]);

  constructor () {
    effect(() => {
      const propValue = this.propValue();

      this.formControl.setValue(propValue);
    });
    
    effect(() => {
      const isSubmitted = this.submitted();

      if (isSubmitted) {
        this.formControl.enable();
        this.close();
      } else {
        this.formControl.disable();
      }
    });
  }

  onSubmit () {
    if (this.formControl.invalid) return;

    const data: ProfileUpdate = { [this.profileProp()]: this.formControl.value };
    this.onSave.emit(data);
  }
  
  close () {
    this.visible.set(false);
  }
}
