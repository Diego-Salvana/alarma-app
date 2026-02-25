// -------------------
// Enums
// -------------------
export enum State {
  ON = 'On',
  OFF = 'Off'
}

export enum DeviceType {
  MOVEMENT = 'Movimiento',
  WINDOW = 'Ventana',
  SMOKE = 'Humo',
  CAMERA = 'Camara'
}

export enum HouseAction {
  SET_ARMED_STATE = 'SET_ARMED_STATE',
  TRIGGER_ALARM = 'TRIGGER_ALARM',
  SET_LIGHTS = 'SET_LIGHTS',
}

export type ProfileModalField = 'name' | 'lastname' | 'phone';
export type HouseModalField = 'sensorName' | 'houseName' | 'addressStreet' | 'addressNumber' | 'city';

// -------------------
// Objetos
// -------------------

export interface EventLog {
  fechaHora: Date;
}

// -------------------
// Entidades
// -------------------

export interface CentralD {
  sonando: boolean;
}

export interface DeviceD {
  numeroSensor: number;
  estado: State;
}

// -------------------
// Varios
// -------------------

export interface NewPassword {
  currentPassword: string;
  newPassword: string;
}

export interface NewCode {
  password: string;
  currentCode: string;
  newCode: string;
}

export type ProfileUpdate = { [key in ProfileModalField]?: string };
export type HouseUpdate = { [key in HouseModalField]?: string };
