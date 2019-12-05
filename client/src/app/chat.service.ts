import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket;

  constructor(private http: HttpClient) {
    this.socket = io(Config.server);
  }

  getChatRooms() {
    return this.http.get(`${Config.server}/api/rooms`);
  }

  enterRoom(room: any, user: any) {
    this.socket.emit('join', {
      roomid: room.id,
      name: user.name,
      id: user.id
    });
  }

  leaveRoom(room: any, user: any) {
    this.socket.emit('disjoin', {
      roomid: room.id,
      name: user.name,
      id: user.id
    });
  }

  sendMessage(room: any, user: any, message: string) {
    this.socket.emit('message', {
      roomid: room.id,
      name: user.name,
      message: message,
      id: user.id
    });
  }

  public getMessages() {
    const obs = new Observable( observer => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
      return () => { this.socket.disconnect(); };
    });

    return obs;
  }

  getTalks(room) {
    return this.http.get(`${Config.server}/api/talks/${room.id}`);
  }

}
