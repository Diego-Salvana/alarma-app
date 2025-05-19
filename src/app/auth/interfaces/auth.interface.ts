import { Direccion, Dispositivo, Estado } from '../../shared/interfaces';

export interface Login {
  email: string;
  contrasena: string;
}

export interface Register extends Login {
  nombre: string;
  apellido: string;
  telefono: string;
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
  data: HouseResponse[];
}

export interface HouseResponse {
  _id: string;
  nombre: string;
  direccion: Direccion;
  alarmaEncendida: Estado;
  sonando?: boolean;
  sensores?: Dispositivo[];
  token?: string;
}
