import {StyleSheet} from 'react-native';
import {colors} from '@super-app/core';

export const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: colors.primaryLight,
    borderColor: '#FFFFFF',
  },
  initials: {
    fontWeight: '700',
    color: colors.primary,
  },
});
