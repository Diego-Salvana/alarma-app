import { Direccion, Estado, HistorialConNombre, Sensor } from './models.interface';

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
  data: HouseResponse [];
}

export interface HouseResponse {
  _id: string;
  nombre: string;
  direccion: Direccion;
  alarmaEncendida: Estado;
  sonando?: boolean;
  sensores?: Sensor[];
  token?: string;
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
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  habilitado: boolean;
  casas: HouseResponse[];
}

export interface InfoHistoryResponse {
  message: string;
  data: HistorialConNombre[];
}
