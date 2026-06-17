import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import ar from './ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'arqiva_lang',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;

export function applyDirection(lang: string) {
  const isRtl = lang === 'ar';
  // Brief fade so the directional re-layout isn't jarring
  document.body.classList.add('lang-switching');
  requestAnimationFrame(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle('rtl', isRtl);
    setTimeout(() => document.body.classList.remove('lang-switching'), 200);
  });
}
