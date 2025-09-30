type RequestState = 'success' | 'pending' | 'error';

export interface ActivationResponse {
  message: string;
  state: RequestState;
}
