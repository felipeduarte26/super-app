import {translations, type AppLocale, type TranslationKeys} from './translations';

type Listener = (locale: AppLocale) => void;

class I18nStoreClass {
  private currentLocale: AppLocale = 'pt-BR';
  private listeners = new Set<Listener>();

  getLocale(): AppLocale {
    return this.currentLocale;
  }

  setLocale(locale: AppLocale): void {
    if (locale === this.currentLocale) {
      return;
    }
    this.currentLocale = locale;
    this.listeners.forEach(fn => fn(locale));
  }

  t(key: keyof TranslationKeys, params?: Record<string, string | number>): string {
    const dict = translations[this.currentLocale];
    let text = dict[key] ?? key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }

    return text;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const I18nStore = new I18nStoreClass();
