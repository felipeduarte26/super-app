import React from 'react';
import {Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {styles} from './Badge.styles';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  primary: {bg: colors.primaryLight, text: colors.primaryDark},
  success: {bg: colors.successLight, text: colors.success},
  warning: {bg: colors.warningLight, text: colors.warning},
  error: {bg: colors.errorLight, text: colors.error},
};

export function Badge({label, variant = 'primary'}: BadgeProps) {
  const scheme = variantStyles[variant];

  return (
    <View style={[styles.badge, {backgroundColor: scheme.bg}]}>
      <Text style={[styles.text, {color: scheme.text}]}>{label}</Text>
    </View>
  );
}
