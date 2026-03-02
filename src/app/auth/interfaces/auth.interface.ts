export interface Login {
  email: string;
  contrasena: string;
}

export interface Register extends Login {
  nombre: string;
  apellido: string;
  telefono: string;
}
