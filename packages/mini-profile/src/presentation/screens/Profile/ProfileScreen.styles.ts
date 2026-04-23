import {StyleSheet} from 'react-native';

export const darkTheme = {
  background: '#111827',
  surface: '#1F2937',
  surfaceVariant: '#374151',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textDisabled: '#6B7280',
  border: '#4B5563',
  header: '#1E3A8A',
  onPrimary: '#FFFFFF',
} as const;

export type ProfileThemeTokens = {
  text: string;
  textSecondary: string;
  error: string;
  primary: string;
};

export function createStyles(theme: ProfileThemeTokens) {
  return StyleSheet.create({
    root: {
      flexGrow: 1,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    loadingLabel: {
      marginTop: 12,
      fontSize: 14,
    },
    header: {
      paddingBottom: 28,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      alignItems: 'center',
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: '700',
    },
    headerName: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
    },
    headerEmail: {
      fontSize: 14,
      marginTop: 6,
      opacity: 0.92,
      textAlign: 'center',
    },
    memberSince: {
      fontSize: 12,
      marginTop: 10,
      opacity: 0.85,
    },
    demoCard: {
      marginHorizontal: 0,
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    demoText: {
      fontSize: 13,
      marginTop: 12,
      lineHeight: 20,
    },
    demoHighlight: {
      fontWeight: '700',
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    labelSpaced: {
      marginTop: 16,
    },
    input: {
      marginTop: 6,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
    },
    inputMultiline: {
      minHeight: 100,
      paddingTop: 12,
    },
    charCount: {
      fontSize: 11,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    fieldError: {
      color: theme.error,
      fontSize: 12,
      marginTop: 6,
    },
    saveButton: {
      marginTop: 22,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.7,
    },
    saveButtonLabel: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    footerSpacer: {
      height: 32,
    },
  });
}
