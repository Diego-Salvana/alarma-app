import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = io('http://localhost:5000');

  emit (event: string, data: string) {
    this.socket.emit(event, data);
  }

  on (event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      // Revisar por qué no se destruye la conexión.
      return () => {
        this.socket.off(event);
      };
    });
  }
}
