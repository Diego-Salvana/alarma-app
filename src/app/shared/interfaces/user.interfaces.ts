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
