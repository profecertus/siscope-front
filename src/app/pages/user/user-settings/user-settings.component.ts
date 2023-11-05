import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'da-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  menus = [
    {
      isActive: true,
      title: 'Ajustes Básicos'
    },
    {
      isActive: false,
      title: 'Ajustes de Seguridad'
    },
    {
      isActive: false,
      title: 'Ajuste de Notificación'
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  itemClickFn(clickedItem: any) {
    this.menus.forEach((item) => {
      item.isActive = false;
    });
    clickedItem.isActive = true;
  }
}
