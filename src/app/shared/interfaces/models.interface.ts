export enum Estado {
  ENCENDIDO = 'On',
  APAGADO = 'Off'
}

export interface Historial {
  fechaHora: Date;
}

export interface Direccion {
  calle: string;
  numero: number;
  ciudad: string;
}

export interface Dispositivo {
  dispositivoId: string;
  numeroSensor: number;
  nombre: string;
  tipo: string; // Usar un tipo enum si los valores de tipo son limitados
  estado: Estado;
  historial: Historial[];
}

export interface Sensor extends Dispositivo { }

// Central Interface
export interface Central {
  centralId: string;
  nombre: string;
  codigo: number;
  alarmaEncendida: Estado;
  sonando: boolean;
  historial: Historial[];
}

// Casa Interface
export interface Casa {
  _id: string;
  nombre: string;
  nombreCasa: string;
  direccion: Direccion;
  central: Central;
  sensores: Dispositivo[];
  camaras: Dispositivo[];
}

// Usuario Interface
export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  contrasena: string;
  mosquittoPass: string;
  telefono: string;
  habilitado: boolean;
  casas: Casa[];
}
