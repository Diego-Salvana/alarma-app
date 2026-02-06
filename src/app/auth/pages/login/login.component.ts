import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { markAllAsDirtyAndTouched } from '../../utils';
import { Login } from '../../interfaces';
import { AuthService } from '../../services';
import { LogoComponent } from '../../components';
import { ToastService } from '../../../shared/services';
import { emailRexExp } from '../../../shared/utils';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CheckboxModule, InputTextModule, ButtonModule, CardModule, PasswordModule, ReactiveFormsModule, RouterLink, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  disabled = signal(false);
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(emailRexExp)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  ngOnInit () {
    if (localStorage.getItem('username')) {
      this.loginForm.controls.rememberMe.setValue(true);
      this.loginForm.controls.username.setValue(localStorage.getItem('username'));
    }
  }

  onSubmit () {
    markAllAsDirtyAndTouched(this.loginForm);
    
    if (this.loginForm.invalid) return;

    this.disabled.set(true);
    this.loginForm.disable();

    const values = this.loginForm.getRawValue();
    const loginBody: Login = {
      email: values.username?.trim() ?? '',
      contrasena: values.password?.trim() ?? ''
    };
    
    this.authService
      .login(loginBody, values.rememberMe ?? false)
      .pipe(finalize(() => {
        this.disabled.set(false);
        this.loginForm.enable();
      }))
      .subscribe({
        next: userInfo =>
          userInfo.data.habilitado
            ? this.router.navigate(['/dashboard', 'home'])
            : this.router.navigate(['/auth', 'send-verification-email']),
        error: err => this.handleLoginError(err)
      });
  }

  private handleLoginError (err: HttpErrorResponse) {
    err.status === 401 || err.status === 404
      ? this.toastService.error('Usuario o contraseña incorrectos')
      : this.toastService.error('Error al iniciar sesión');
  }
}
