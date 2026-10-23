import { State } from '../../shared/interfaces';

interface WebSocketTransferBase {
  house: string;
}

export interface AlarmArming extends WebSocketTransferBase {
  state: State;
  excludedSensors: string[];
}

export interface TriggeredAlarm extends WebSocketTransferBase {
  ringing: boolean;
  sensorNumber?: number;
}

export interface Lights extends WebSocketTransferBase {
  sector: string;
  state: State;
}

export enum WarningType {
  DEVICE_STATE = 'DEVICE_STATE',
  LIGHTS_STATE = 'LIGHTS_STATE',
  TRIGGER_ALARM = 'TRIGGER_ALARM'
}

export interface Warning {
  type: WarningType;
  message: string;
}
