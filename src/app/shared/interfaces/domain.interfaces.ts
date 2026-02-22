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
