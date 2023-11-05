import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ThemeServiceInit, devuiDarkTheme, Theme } from 'ng-devui/theme';
import { AppModule } from './app/app.module';

import {
  infinityTheme,
  sweetTheme,
  provenceTheme,
  deepTheme
} from 'ng-devui/theme-collection';

const customTheme = new Theme({
  id: `customize-theme`,
  name: 'custom',
  cnName: 'Chino',
  data: {},
  isDark: true
});

ThemeServiceInit({
  deepTheme,
  infinityTheme,
  sweetTheme,
  provenceTheme,
  devuiDarkTheme,
  customTheme
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
