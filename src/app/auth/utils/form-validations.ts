import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator (confirmPassword: FormControl): ValidationErrors | null {
  const password = confirmPassword.root.get('password') ?? confirmPassword.root.get('newPassword');

  return password && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

export function markAllAsDirtyAndTouched (form: FormGroup) {
  const controls = form.controls;
  
  for (const field in controls) controls[field].markAsDirty();
  
  form.markAllAsTouched();
}
