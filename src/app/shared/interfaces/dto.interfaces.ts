import { DeviceResponse, HouseResponse, ProfileResponse } from '.';

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
  number: DeviceResponse['number'];
  name: DeviceResponse['name'];
}

export interface TriggerDTO {
  ringing: HouseResponse['ringing'],
  number?: DeviceResponse['number']
}

export interface SensorArmConfigDTO {
  number: DeviceResponse['number'];
  state: DeviceResponse['state'];
};

export interface AlarmCodeUpdateDTO {
  password: string;
  currentCode: string;
  newCode: string;
}
