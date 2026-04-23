import {StyleSheet} from 'react-native';
import {colors} from '@super-app/core';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    backgroundColor: colors.primary,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
