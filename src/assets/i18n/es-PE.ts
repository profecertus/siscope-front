import pages from './es-PE/page';
import form from './es-PE/form';
import abnormal from './es-PE/abnormal';
import personalize from './es-PE/personalize';
import list from './es-PE/list';
import dashboard from './es-PE/dashboard';
import login from './es-PE/login';
import register from './es-PE/register';
import sideSetting from './es-PE/side-setting';
import header from './es-PE/header';
import footer from './es-PE/footer';
import authGuard from './es-PE/auth-guard';
import notice from './es-PE/notice';

export default {
  ...pages,
  ...form,
  ...list,
  ...abnormal,
  ...personalize,
  ...dashboard,
  ...login,
  ...register,
  ...sideSetting,
  ...header,
  ...footer,
  ...authGuard,
  ...notice,
};
