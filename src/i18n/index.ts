import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en';
import kr from './kr';

export const translationsJson = {
  en,
  kr,
};

export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: translationsJson,
    fallbackLng: 'kr',
    lng: 'kr',
    interpolation: {
      escapeValue: false,
    },
  });
