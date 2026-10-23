import { SensorType, State } from './domain.interfaces';

/* Estructura general de respuesta */
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// -------------------
// Login
// -------------------
export interface LoginResponse {
  firstName: string;
  email: string;
  enabled: boolean;
  token: string;
  houses: HouseResponse[];
}

export interface ProfileResponse {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  enabled: boolean;
  houses: HouseResponse[];
}

export interface TokenResponse {
  token: string;
}

// -------------------
// Houses
// -------------------
export interface HouseResponse {
  _id: string;
  name: string;
  houseName: string;
  address: AddressResponse;
  alarmState: State;
  ringing?: boolean;
  sensors?: SensorResponse[];
  cameras?: CameraResponse[];
  token?: string;
}

export interface AddressResponse {
  street: string;
  number: string;
  city: string;
  country: string;
}

export interface CameraResponse {
  model: string;
  number: number;
  name: string;
}

export interface CentralHistoryResponse {
  history: CentralEventResponse[];
}

export interface CentralEventResponse {
  date: Date;
  type?: string;
  deviceName?: string;
  sensorNumber?: number;
  userId?: string;
}

// -------------------
// Devices
// -------------------
export interface SensorEventDateResponse {
  date: Date;
}

export interface SensorResponse {
  model: string;
  number: number;
  name: string;
  type: SensorType;
  state: State;
  history?: SensorEventDateResponse[];
}

// -------------------
// Profile
// -------------------
