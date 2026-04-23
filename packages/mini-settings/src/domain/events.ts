/**
 * Eventos CUSTOMIZADOS do Mini Settings.
 *
 * Estes eventos NÃO estão no core — demonstram comunicação
 * entre mini-apps usando strings puras.
 *
 * Convenção: 'modulo:acao'
 */
export const SettingsCustomEvents = {
  BIOMETRIC_TOGGLED: 'settings:biometric_toggled',
} as const;

export interface SettingsCustomPayloads {
  [SettingsCustomEvents.BIOMETRIC_TOGGLED]: {enabled: boolean};
}
