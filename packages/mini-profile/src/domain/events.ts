/**
 * Eventos CUSTOMIZADOS do Mini Profile.
 *
 * Estes eventos NÃO estão no core — demonstram comunicação
 * entre mini-apps usando strings puras + request/response.
 *
 * Convenção: 'modulo:acao'
 */
export const ProfileCustomEvents = {
  GET_SUMMARY: 'profile:get_summary',
} as const;

export interface ProfileSummary {
  displayName: string;
  email: string;
  avatarInitials: string;
}
