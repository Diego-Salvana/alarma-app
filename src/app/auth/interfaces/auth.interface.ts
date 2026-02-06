export interface Login {
  email: string;
  contrasena: string;
}

export interface Register extends Login {
  nombre: string;
  apellido: string;
  telefono: string;
}

export interface EmailVerification {
  message: string;
  token: string;
}

export interface PasswordResetResponse {
  token: string;
}
