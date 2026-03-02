import { DeviceType, EventLog, State } from './domain.interfaces';

/* Estructura general de respuesta */
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// -------------------
// Login
// -------------------
export interface LoginResponse extends ProfileResponse {
  token: string;
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

export interface TokenResponse {
  token: string;
}

// -------------------
// Houses
// -------------------
export interface InfoHouseResponse {
  message: string;
  data: HouseResponse;
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

export interface AddressResponse {
  calle: string;
  numero: string;
  ciudad: string;
}

export interface CentralHistoryResponse {
  history: CentralEventResponse[];
}

export interface CentralEventResponse {
  fechaHora: Date;
  nombreDispositivo: string;
}

// -------------------
// Devices
// -------------------
export interface DeviceResponse {
  dispositivoId: string;
  numeroSensor: number;
  nombre: string;
  tipo: DeviceType;
  estado: State;
  historial: EventLog[];
}

// -------------------
// Profile
// -------------------
