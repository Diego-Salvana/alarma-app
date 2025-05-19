export interface Sensor {
  id: number;
  nombre: string;
  estado: boolean;
}

export interface House {
  id: number;
  nombre: string;
  nombreCasa?: string;
  direccion?: any;
  central?: any;
  sensores?: Sensor[];
}
