import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'da-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['../user-settings.component.scss'],
})
export class MessageNotificationComponent implements OnInit {
  messageItems = [
    {
      title: 'Contraseña de la cuenta',
      description: 'La información relacionada con la cuenta se notificará en forma de mensajes en el sitio.',
    },
    {
      title: 'Información del Sistema',
      description: 'Los mensajes del sistema se notificarán en forma de mensajes del sitio.'
    },
    {
      title: 'Aviso de Servicio',
      description: 'Las notificaciones de servicio se notificarán en forma de mensajes en el sitio.'
    },
    {
      title: 'Próximas Tareas',
      description: 'Las tareas pendientes se notificarán en forma de mensajes en el sitio'
    }
  ]
  constructor() {}

  ngOnInit(): void {}
}
