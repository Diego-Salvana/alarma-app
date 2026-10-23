import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { ENV } from '../../env';
import { SOCKET_PATH } from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = io(ENV.SOCKET_URL, {
    path: SOCKET_PATH,
    auth: {
      token: localStorage.getItem('token')
    }
  });

  emit (event: string, data: string) {
    this.socket.emit(event, data);
  }

  on <T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }
}
