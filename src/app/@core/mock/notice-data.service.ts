import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { Notification, Message, Todo, NoticeData } from '../data/noticeData';

@Injectable()
export class NoticeDataService extends NoticeData {
  private notifications: Notification[] = [
    {
      type: 'success',
      title: 'La solicitud XXX que envió ha sido aprobada.',
      time: 'Hace 1 dia',
      icon: 'notice',
      id: '1',
      status: 0,
    },
    {
      type: 'warning',
      title: 'La persona que recomendaste ya está pasando por el proceso.',
      time: 'Hace 2 dias',
      icon: 'message-2',
      id: '2',
      status: 0,
    },
    {
      type: 'warning',
      title: 'Habrá una reunión anticipada el 1 de julio de 2021.',
      time: 'Hace 3 dias',
      icon: 'message-2',
      id: '3',
      status: 0,
    },
    {
      type: 'info',
      title: 'La solicitud XXX que envió ha sido aprobada.',
      time: 'Hace 4 dias',
      icon: 'infomation',
      id: '4',
      status: 0,
    },
    {
      type: 'info',
      title: 'La solicitud XXX que envió ha sido aprobada.',
      time: 'Hace 5 dias',
      icon: 'infomation',
      id: '5',
      status: 0,
    },
    {
      type: 'info',
      title: 'La solicitud XXX que envió ha sido aprobada.',
      time: 'Hace 5 dias',
      icon: 'infomation',
      id: '6',
      status: 0,
    },
  ];

  private messages: Message[] = [
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX发件人',
      content: '左侧头像为发信者的头像，收到的来自别人的未读信息',
      time: '2天前',
      id: '1',
      status: 0,
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '2',
      status: 0,
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '3',
      status: 0,
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '4',
      status: 0,
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '5',
      status: 0,
    },
  ];

  private todos: Todo[] = [
    {
      tagName: '进行中',
      tagType: 'olivine-w98',
      title: '参加可信考试',
      memo: '一年内要通过考试，持证上岗',
      id: '1',
      status: 0,
    },
    {
      tagName: '已逾期2天',
      tagType: 'orange-w98',
      title: 'Bug单处理',
      memo: '有个bug单需要处理，来自SL的指派',
      id: '2',
      status: 0,
    },
    {
      tagName: '待开始',
      tagType: 'blue-w98',
      title: '待办事项名称',
      memo: '右侧为事项相关说明',
      id: '3',
      status: 0,
    },
    {
      tagName: '逾期10天',
      tagType: 'red-w98',
      title: '待办事项名称',
      memo: '对于该事项的描述',
      id: '4',
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
