import {useCallback, useEffect, useState} from 'react';
import {I18nStore} from './I18nStore';
import type {AppLocale, TranslationKeys} from './translations';

export function useTranslation() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return I18nStore.subscribe(() => {
      setTick(prev => prev + 1);
    });
  }, []);

  const t = useCallback(
    (key: keyof TranslationKeys, params?: Record<string, string | number>) => {
      return I18nStore.t(key, params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const locale: AppLocale = I18nStore.getLocale();

  return {t, locale};
}
