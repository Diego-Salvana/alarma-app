import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { markAllAsDirtyAndTouched } from '../../utils';
import { Login } from '../../interfaces';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  imports: [CheckboxModule, InputTextModule, ButtonModule, CardModule, PasswordModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private emailRexExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  disabled = signal(false);
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(this.emailRexExp)]],
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

    const loginBody: Partial<Login> = {
      email: this.loginForm.value.username?.trim() ?? undefined,
      contrasena: this.loginForm.value.password?.trim() ?? undefined
    };
    
    this.authService.loginUser(loginBody, this.loginForm.controls.rememberMe.value ?? false).subscribe({
      next: (data) => {
        this.disabled.set(false);
        this.loginForm.enable();
        console.log(data);

        this.router.navigate(['/dashboard', 'home']);
      },
      error: (e) => {
        this.disabled.set(false);
        this.loginForm.enable();
        console.error(e); // Borrar en producción

        this.messageService.add({ severity: 'contrast', summary: 'Error', detail: e.error.message });
      }
    });
  }
}
