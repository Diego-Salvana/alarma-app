type RequestState = 'success' | 'pending' | 'error';

export interface StatusRequest {
  message: string;
  state: RequestState;
}
