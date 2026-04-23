import {StyleSheet} from 'react-native';
import {colors} from '@super-app/core';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrap: {
    width: 40,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  body: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  hint: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
