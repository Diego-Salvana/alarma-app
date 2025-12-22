type RequestState = 'success' | 'pending' | 'error';

export interface ArmedStateResponse {
  message: string;
  state: RequestState;
}
