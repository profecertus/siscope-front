import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import {
  devuiDarkTheme, devuiLightTheme,
  ThemeServiceInit
} from 'ng-devui/theme';
import { deepTheme, galaxyTheme, infinityTheme, provenceTheme, sweetTheme } from 'ng-devui/theme-collection';
import { devuiLargeFontTheme, greenDarkTheme, greenLightTheme } from '../devui-commons/src/header/theme-picker/theme-data-more';

ThemeServiceInit({
  'devui-light-theme': devuiLightTheme,
  'devui-dark-theme': devuiDarkTheme,
  'green-light-theme': greenLightTheme,
  'green-dark-theme': greenDarkTheme,
  'devui-large-font-theme': devuiLargeFontTheme,
  'infinity-theme': infinityTheme,
  'provence-theme': provenceTheme,
  'sweet-theme': sweetTheme,
  'deep-theme': deepTheme,
  'galaxy-theme': galaxyTheme
}, 'infinity-theme', null, null, true);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
