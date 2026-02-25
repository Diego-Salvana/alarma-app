import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator (checkControl: FormControl):
ValidationErrors | null {
  const targetControl =
    checkControl.root.get('password') ??
    checkControl.root.get('newPassword') ??
    checkControl.root.get('newCode');

  return targetControl && targetControl.value !== checkControl.value
    ? { valueMismatch: true }
    : null;
};

export function markAllAsDirtyAndTouched (form: FormGroup) {
  const controls = form.controls;
  
  for (const field in controls) controls[field].markAsDirty();
  
  form.markAllAsTouched();
}
