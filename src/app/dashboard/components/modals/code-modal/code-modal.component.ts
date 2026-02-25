import { ChangeDetectionStrategy, Component, effect, inject, input, model, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { markAllAsDirtyAndTouched, passwordMatchValidator } from '../../../../auth/utils';
import { NewCode } from '../../../../shared/interfaces';

@Component({
  selector: 'app-code-modal',
  imports: [DialogModule, ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './code-modal.component.html',
  styleUrl: './code-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  visible = model<boolean>(false);
  isSubmitted = input.required<boolean>();
  onSave = output<NewCode>();
  codeForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    currentCode: ['', [Validators.pattern('^[0-9]{6}$')]],
    newCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    confirmCode: ['', [passwordMatchValidator]]
  });

  constructor () {
    effect(() => {
      const isSubmitted = this.isSubmitted();

      if (isSubmitted) {
        this.close();
        this.codeForm.reset();
      };
    });
  }

  ngOnInit () {
    this.codeForm.controls.newCode.valueChanges.subscribe(() => {
      const confirmControl = this.codeForm.controls.confirmCode;
      
      confirmControl.setValue(confirmControl.value);
    });
  }

  onSubmit () {
    markAllAsDirtyAndTouched(this.codeForm);
    
    if (this.codeForm.invalid) return;
    
    const values = this.codeForm.getRawValue();
    const data: NewCode = {
      password: values.password ?? '',
      currentCode: values.currentCode ?? '',
      newCode: values.newCode ?? ''
    };

    this.onSave.emit(data);
  }

  close () {
    this.visible.set(false);
  }
}
