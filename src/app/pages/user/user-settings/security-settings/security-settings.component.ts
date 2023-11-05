import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'da-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['../user-settings.component.scss'],
})
export class SecuritySettingsComponent implements OnInit {
  securityItems = [
    {
      title: 'Contaseña',
      description: 'Su contaseña es：',
      results: 'Fuerte'
    },
    {
      title: 'Telefono móvil',
      description: 'Teléfono móvil vinculado：',
      results: '188***1234'
    },
    {
      title: 'Vincular Email',
      description: 'Email vinculado：',
      results: 'devui***admin.com'
    }
  ]

  constructor() {}

  ngOnInit(): void {}
}
