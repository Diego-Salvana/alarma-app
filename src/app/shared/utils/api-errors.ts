import { HttpErrorResponse } from '@angular/common/http';

/** Obtiene el mensaje de error para mostrar al usuario en español. Normaliza el bloqueo del usuario. */
export function getErrorMessage (err: HttpErrorResponse): string {
  return err.status === 403
    ? 'Acción no permitida para el usuario'
    : err.error?.message ?? 'Ocurrió un error';
}
