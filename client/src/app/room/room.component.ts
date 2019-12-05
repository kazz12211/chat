import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  rooms = [];
  selectedRoom;
  talks = [];
  message: string;
  connection: Subscription;
  email: string;
  password: string;

  constructor(private chat: ChatService, private auth: AuthService) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.chat.getChatRooms().subscribe((result: any[]) => {
        this.rooms = result;
        this.connection = this.chat.getMessages().subscribe((message: any) => {
          if (message.roomid === this.selectedRoom.id) {
            console.log(message);
            this.talks.push(message);
          }
        });
        this.selectRoom(this.rooms[0]);
      });
    }
  }

  selectRoom(room: any) {
    if (!this.selectedRoom || room.id !== this.selectedRoom.id) {
      this.chat.getTalks(room).subscribe((talks: any[]) => {
        this.talks = talks;
        this.auth.getUser().subscribe(user => {
          if (this.selectedRoom) {
            this.chat.leaveRoom(this.selectedRoom, user);
          }
          this.selectedRoom = room;
          this.chat.enterRoom(this.selectedRoom, user);
        });
      });
    }
  }

  roomNavClass(room: any) {
    const classes = ['nav-link', 'link'];
    if (room && this.selectedRoom && room.id === this.selectedRoom.id) {
      classes.push('active');
    }
    return classes;
  }

  messageClass(talk: any) {
    const classes = ['mb-1'];
    if( talk.type === 'status') {
      classes.push('text-muted');
    }
    return classes;
  }

  sendMessage() {
    this.auth.getUser().subscribe(user => {
      this.chat.sendMessage(this.selectedRoom, user, this.message);
      this.message = '';
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  signin() {
    this.auth.signin(this.email, this.password);
    this.chat.getChatRooms().subscribe((result: any[]) => {
      this.rooms = result;
      this.selectRoom(this.rooms[0]);
    });
  }

}
