import {StyleSheet} from 'react-native';
import {colors} from '@super-app/core';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  timeAgo: {
    fontSize: 11,
    color: colors.textDisabled,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
});
