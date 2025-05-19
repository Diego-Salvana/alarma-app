import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { markAllAsDirtyAndTouched, passwordMatchValidator } from '../../utils';
import { AuthService } from '../../services';
import { Register } from '../../interfaces';

@Component({
  selector: 'app-register',
  imports: [InputTextModule, ButtonModule, CardModule, PasswordModule, RouterModule, InputMaskModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private emailRexExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  disabled = signal(false);
  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(this.emailRexExp)]],
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

    const userBody: Partial<Register> = {
      nombre: this.registerForm.value.name?.trim() ?? undefined,
      apellido: this.registerForm.value.lastname?.trim() ?? undefined,
      email: this.registerForm.value.email?.trim() ?? undefined,
      telefono: this.registerForm.value.phone?.trim() ?? undefined,
      contrasena: this.registerForm.value.password?.trim() ?? undefined
    };
    
    this.authService.registerUser(userBody).subscribe({
      next: (data) => {
        this.disabled.set(false);
        this.registerForm.enable();
        console.log(data);

        this.router.navigate(['/dashboard', 'home']);
      },
      error: (e) => {
        this.disabled.set(false);
        this.registerForm.enable();
        console.error(e); // Borrar en producción

        this.messageService.add({ severity: 'contrast', summary: 'Error', detail: e.error.message });
      }
    });
  }
}
