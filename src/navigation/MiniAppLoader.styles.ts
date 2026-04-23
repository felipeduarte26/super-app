import {StyleSheet} from 'react-native';
import {colors} from '@super-app/core';

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  loadingHint: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.error,
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorHint: {
    marginTop: 16,
    fontSize: 12,
    color: colors.textDisabled,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
