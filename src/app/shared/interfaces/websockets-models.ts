import { Estado } from './models.interface';

export interface AlarmActivation {
  state: Estado;
  excludedSensors: string[];
}

type Topic = 'alarmActivation' | 'ringing';

export interface SocketError {
  event: Topic;
  message: string;
}
