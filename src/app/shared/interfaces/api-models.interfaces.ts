import { DeviceType, State } from './domain.interfaces';

/* Estructura general de respuesta */
export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PendingResponse {
  status: 'pending';
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
export interface InfoHouseResponse {
  message: string;
  data: HouseResponse;
}

export interface HouseResponse {
  _id: string;
  name: string;
  houseName: string;
  address: AddressResponse;
  alarmState: State;
  ringing?: boolean;
  sensors?: DeviceResponse[];
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
export interface DeviceResponse {
  model: string;
  number: number;
  name: string;
  type: DeviceType;
  state: State;
}

// -------------------
// Profile
// -------------------
