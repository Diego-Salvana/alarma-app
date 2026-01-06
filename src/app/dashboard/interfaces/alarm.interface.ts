import { Estado } from '../../shared/interfaces';

type RequestState = 'success' | 'pending' | 'error';

export interface StatusRequest {
  message: string;
  state: RequestState;
}

export interface Trigger {
  state: Estado;
}
