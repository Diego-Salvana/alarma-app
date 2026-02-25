import { DeviceType, EventLog, State } from './domain.interfaces';
import { HistorialConNombre, Sensor } from './models.interface';

/* Estructura general de respuesta */
export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface InfoLoginResponse {
  message: string;
  data: LoginResponse;
}

export interface LoginResponse {
  nombre: string;
  email: string;
  habilitado: boolean;
  token: string;
  casas: HouseResponse[];
}

export interface InfoHouseResponse {
  message: string;
  data: HouseResponse;
}

export interface InfoHousesResponse {
  message: string;
  data: HouseResponse[];
}

export interface HouseResponse {
  _id: string;
  nombre: string;
  nombreCasa: string;
  direccion: AddressResponse;
  alarmaEncendida: State;
  sonando?: boolean;
  sensores?: DeviceResponse[];
  token?: string;
}

export interface DeviceResponse {
  dispositivoId: string;
  numeroSensor: number;
  nombre: string;
  tipo: DeviceType;
  estado: State;
  historial: EventLog[];
}

export interface AddressResponse {
  calle: string;
  numero: string;
  ciudad: string;
}

export interface InfoSensorResponse {
  message: string;
  data: Sensor;
}

export interface InfoProfileResponse {
  message: string;
  data: ProfileResponse;
}

export interface ProfileResponse {
  _id: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  telefono: string;
  habilitado: boolean;
  casas: HouseResponse[];
}

export interface InfoHistoryResponse {
  message: string;
  data: HistorialConNombre[];
}

export interface EmailVerification {
  message: string;
  token: string;
}
