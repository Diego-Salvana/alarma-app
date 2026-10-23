// -------------------
// Enums
// -------------------
export enum State {
  ON = 'On',
  OFF = 'Off'
}

export enum SensorType {
  MOVEMENT = 'Movimiento',
  WINDOW = 'Ventana',
  SMOKE = 'Humo'
}

export enum ControlPanelEventType {
  ARMED = 'ARMED',
  DISARMED = 'DISARMED',
  SIREN_ON = 'SIREN_ON',
  SIREN_OFF = 'SIREN_OFF'
}

export type ProfileModalField = 'name' | 'lastname' | 'phone';
export type HouseModalField = 'sensorName' | 'houseName' | 'addressStreet' | 'addressNumber' | 'city';

// -------------------
// Objetos
// -------------------

export interface EventLog {
  date: Date;
  type?: ControlPanelEventType | 'SENSOR';
  deviceName?: string;
  sensorNumber?: number;
  userId?: string;
}

export interface CentralEvent {
  date: Date;
  type?: ControlPanelEventType | 'SENSOR';
  deviceName?: string;
  sensorNumber?: number;
  userId?: string;
}

// -------------------
// Entidades
// -------------------
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  isEnabled: boolean;
  houses: House[];
}

export interface House {
  id: string;
  displayName: string;
  houseName: string;
  address: Address;
  alarmState: State;
  isRinging: boolean;
  sensors: Sensor[];
  cameras?: Camera[];
}

export interface Address {
  street: string;
  number: string;
  city: string;
  country?: string;
}

export interface Camera {
  model: string;
  number: number;
  name: string;
}

export interface Sensor {
  id: string;
  number: number;
  name: string;
  type: SensorType;
  state: State;
  history: EventLog[];
}

// -------------------
// Formularios
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

export type ExclusionFormValues = Partial<{ [key: string]: State }>;

// -------------------
// Varios
// -------------------

export type ProfileUpdate = { [key in ProfileModalField]?: string };
export type HouseUpdate = { [key in HouseModalField]?: string };
