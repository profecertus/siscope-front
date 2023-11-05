import pages from './es-PE/page';
import start from './es-PE/start';
import personalize from './es-PE/personalize';
import authGuard from './es-PE/auth-guard';
import footer from './es-PE/footer';
import header from './es-PE/header';
import login from './es-PE/login';
import register from './es-PE/register';

export default {
  ...pages,
  ...start,
  ...personalize,
  ...authGuard,
  ...footer,
  ...header,
  ...login,
  ...register,
};
