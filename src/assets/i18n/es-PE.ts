import pages from './es-pe/page';
import form from './es-pe/form';
import abnormal from './es-pe/abnormal';
import personalize from './es-pe/personalize';
import list from './es-pe/list';
import dashboard from './es-pe/dashboard';
import login from './es-pe/login';
import register from './es-pe/register';
import sideSetting from './es-pe/side-setting';
import header from './es-pe/header';
import footer from './es-pe/footer';
import authGuard from './es-pe/auth-guard';
import notice from './es-pe/notice';

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
