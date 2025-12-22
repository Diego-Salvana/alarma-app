import { Estado } from './models.interface';

export interface AlarmArming {
  state: Estado;
  excludedSensors: string[];
}

enum AlarmAction {
  SET_ARMED_STATE = 'SET_ARMED_STATE',
  TRIGGER = 'TRIGGER',
}

export interface HouseSocketError {
  houseName: string;
  action: AlarmAction;
  message: string;
}
