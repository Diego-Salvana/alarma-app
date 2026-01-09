import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { markAllAsDirtyAndTouched, passwordMatchValidator } from '../../utils';
import { AuthService } from '../../services';
import { Register } from '../../interfaces';
import { LogoComponent } from '../../components';
import { ToastService } from '../../../shared/services';
import { finalize } from 'rxjs';
import { emailRexExp } from '../../../shared/utils';

@Component({
  selector: 'app-register',
  imports: [InputTextModule, ButtonModule, CardModule, PasswordModule, RouterModule, InputMaskModule, ReactiveFormsModule, LogoComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  disabled = signal(false);
  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(emailRexExp)]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, passwordMatchValidator]]
  });

  ngOnInit () {
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      const rePassControl = this.registerForm.controls.confirmPassword;
      rePassControl.setValue(rePassControl.value);
    });
  }

  onSubmit () {
    markAllAsDirtyAndTouched(this.registerForm);
    
    if (this.registerForm.invalid) return;

    this.disabled.set(true);
    this.registerForm.disable();
    
    const values = this.registerForm.getRawValue();
    const userBody: Register = {
      nombre: values.name ?? '',
      apellido: values.lastname?.trim() ?? '',
      email: values.email?.trim() ?? '',
      telefono: values.phone?.trim() ?? '',
      contrasena: values.password?.trim() ?? ''
    };
    
    this.authService
      .register(userBody)
      .pipe(finalize(() => {
        this.disabled.set(false);
        this.registerForm.enable();
      }))
      .subscribe({
        next: () => {
          this.registerForm.reset();
          this.toastService.info('Registro exitoso.');
          this.toastService.info('Verifica la cuenta desde tu email.');
        },
        error: err => this.toastService.error(err.error.message)
      });
  }
}
