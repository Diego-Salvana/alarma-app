import { SensorResponse, HouseResponse, ProfileResponse } from '.';

// ---------------
// Usuario
// ---------------
export interface ProfileUpdateDTO {
  firstName?: ProfileResponse['firstName'];
  lastName?: ProfileResponse['lastName'];
  phone?: ProfileResponse['phone'];
}

export interface PasswordBodyDTO {
  currentPassword: string;
  newPassword: string;
}

// ---------------
// Casas
// ---------------

export interface HouseUpdateDTO {
  name?: HouseResponse['name'];
  address?: Partial<HouseResponse['address']>;
}

export interface SensorNameDTO {
  number: SensorResponse['number'];
  name: SensorResponse['name'];
}

export interface TriggerDTO {
  ringing: HouseResponse['ringing'],
  number?: SensorResponse['number']
}

export interface SensorArmConfigDTO {
  number: SensorResponse['number'];
  state: SensorResponse['state'];
};

export interface AlarmCodeUpdateDTO {
  password: string;
  currentCode: string;
  newCode: string;
}
