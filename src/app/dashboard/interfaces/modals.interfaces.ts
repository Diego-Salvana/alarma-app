import { Casa, Estado } from '../../shared/interfaces';

export type ProfileProp = 'name' | 'lastname' | 'phone' | 'password';

export type HouseProp = 'houseName' | 'street' | 'number' | 'city' | 'sensorName';

export interface ModalDataTransfer {
  name?: string;
  lastname?: string;
  phone?: string;
  houseName?: string;
  street?: string;
  number?: string;
  city?: string;
  sensorName?: string;
  password?: string | null;
  newPassword?: string | null;
}

export interface ExclusionSensor {
  numeroSensor: string;
  estado: Estado | undefined;
};

export interface UpdateHouseDto {
  nombre?: Casa['nombre'];
  direccion?: Partial<Casa['direccion']>;
}

export interface PasswordBody {
  contrasenaActual: string;
  nuevaContrasena: string;
}
