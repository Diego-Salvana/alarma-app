import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_PATH } from '../../env';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = io(SOCKET_URL, { path: SOCKET_PATH });

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
