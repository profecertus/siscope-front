export class I18nUtil {
  private static readonly supportLanguages = ['es-PE', 'en-us'];

  public static getCurrentLanguage() {
    let lang =
      localStorage.getItem('lang') ||
      window.navigator.language.toLowerCase() ||
      'es-PE';
    if (I18nUtil.supportLanguages.indexOf(lang) < 0) {
      lang = I18nUtil.supportLanguages[0];
    }
    return lang;
  }

  public static getSupportLanguages() {
    return I18nUtil.supportLanguages;
  }
}
