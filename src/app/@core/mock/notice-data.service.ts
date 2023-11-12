import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { Notification, Message, Todo, NoticeData } from '../data/noticeData';

@Injectable()
export class NoticeDataService extends NoticeData {
  private notifications: Notification[] = [
    {
      type: 'info',
      title: 'Existen productos nuevos que cargar',
      time: 'Hoy',
      icon: 'infomation',
      id: '1',
      status: 0,
    },
  ];

  private messages: Message[] = [

  ];

  private todos: Todo[] = [
    {
      tagName: 'Mensaje',
      tagType: 'olivine-w98',
      title: 'Existen productos nuevos que cargar',
      memo: 'Tener en cuenta',
      id: '1',
      status: 0,
    },
  ];

  getNotifications(): Observable<Notification[]> {
    return observableOf(this.notifications);
  }
  getMessages(): Observable<Message[]> {
    return observableOf(this.messages);
  }
  getTodos(): Observable<Todo[]> {
    return observableOf(this.todos);
  }
}
