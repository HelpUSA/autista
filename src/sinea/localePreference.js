import {DEFAULT_LANGUAGE,normalizeLocale} from './i18n.js';
const KEY='sinea.demo.language.v1';
/**
 * Somente a preferência pública de idioma pode ser persistida.
 * Jamais guardar perfil, ID de criança, prontuário ou resposta de atividade.
 * O armazenamento é injetado para evitar dependência de APIs do navegador em testes.
 */
export function readLocalePreference(storage){
  try {
    const selected=storage?.getItem?.(KEY);
    return selected===null||selected===undefined?DEFAULT_LANGUAGE:normalizeLocale(selected);
  }catch {return DEFAULT_LANGUAGE;}
}
export function writeLocalePreference(storage,locale){
  const valid=normalizeLocale(locale);
  try {storage?.setItem?.(KEY,valid);return true;}
  catch {return false;}
}
export function localeStorageKey(){return KEY;}
