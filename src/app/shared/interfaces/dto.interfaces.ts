import { DeviceResponse, HouseResponse, ProfileResponse } from '.';
import { CentralD, DeviceD } from './domain.interfaces';

// ---------------
// Usuario
// ---------------
export interface ProfileUpdateDTO {
  nombre?: ProfileResponse['nombre'];
  apellido?: ProfileResponse['apellido'];
  telefono?: ProfileResponse['telefono'];
}

export interface PasswordBodyDTO {
  contrasenaActual: string;
  nuevaContrasena: string;
}

// ---------------
// Casas
// ---------------

export interface HouseUpdateDTO {
  nombre?: HouseResponse['nombre'];
  direccion?: Partial<HouseResponse['direccion']>;
}

export interface SensorNameDTO {
  numeroSensor: DeviceResponse['numeroSensor'];
  nombre: DeviceResponse['nombre'];
}

export interface TriggerDTO {
  sonando: CentralD['sonando'],
  numeroSensor?: DeviceD['numeroSensor']
}

export interface SensorArmConfigDTO {
  numeroSensor: DeviceD['numeroSensor'];
  estado: DeviceD['estado'];
};

export interface AlarmCodeUpdateDTO {
  contrasena: string;
  codigoActual: number;
  nuevoCodigo: number;
}
