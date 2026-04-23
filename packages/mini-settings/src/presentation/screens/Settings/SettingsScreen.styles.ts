import {StyleSheet} from 'react-native';

export const darkTheme = {
  background: '#111827',
  surface: '#1F2937',
  surfaceVariant: '#374151',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textDisabled: '#6B7280',
  border: '#4B5563',
  divider: '#374151',
} as const;

export type SettingsThemeTokens = {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  border: string;
  divider: string;
  primary: string;
  primaryLight: string;
  success: string;
  error: string;
};

export function createStyles(theme: SettingsThemeTokens) {
  return StyleSheet.create({
    root: {
      flex: 1,
      paddingBottom: 32,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 8,
    },
    headerIcon: {
      fontSize: 28,
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.text,
    },
    headerSubtitle: {
      marginTop: 6,
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    errorCard: {
      borderWidth: 1,
      marginTop: 8,
    },
    errorText: {
      fontSize: 14,
      fontWeight: '600',
    },
    cardInner: {
      marginHorizontal: 0,
      paddingVertical: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    rowIconWrap: {
      width: 40,
      alignItems: 'center',
    },
    rowEmoji: {
      fontSize: 22,
    },
    rowBody: {
      flex: 1,
      paddingRight: 12,
    },
    rowTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    rowTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    rowHint: {
      marginTop: 4,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    langHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6,
    },
    sectionHint: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 18,
    },
    langRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 4,
    },
    langLabel: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    langCode: {
      fontSize: 13,
      color: theme.textDisabled,
      marginRight: 12,
      fontVariant: ['tabular-nums'],
    },
    checkmark: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.success,
      width: 28,
      textAlign: 'center',
    },
    checkPlaceholder: {
      width: 28,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.divider,
    },
    aboutLabel: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    versionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      gap: 10,
    },
    versionValue: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
      fontVariant: ['tabular-nums'],
    },
    aboutFootnote: {
      marginTop: 14,
      fontSize: 13,
      color: theme.textDisabled,
      lineHeight: 18,
    },
    resetButton: {
      marginHorizontal: 16,
      marginTop: 28,
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    resetDisabled: {
      opacity: 0.6,
    },
    resetButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    footerLoading: {
      marginTop: 16,
      alignItems: 'center',
    },
  });
}
