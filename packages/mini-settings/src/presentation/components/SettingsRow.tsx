import React from 'react';
import {Switch, Text, View} from 'react-native';
import {styles} from './SettingsRow.styles';

interface SettingsRowProps {
  icon: string;
  title: string;
  hint?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColorFalse?: string;
  trackColorTrue?: string;
  thumbColor?: string;
  rightElement?: React.ReactNode;
}

export function SettingsRow({
  icon,
  title,
  hint,
  value,
  onValueChange,
  disabled = false,
  trackColorFalse,
  trackColorTrue,
  thumbColor,
  rightElement,
}: SettingsRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Text style={styles.emoji}>{icon}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {rightElement}
        </View>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: trackColorFalse ?? '#E5E7EB',
          true: trackColorTrue ?? '#DBEAFE',
        }}
        thumbColor={thumbColor ?? (value ? '#2563EB' : '#f4f3f4')}
      />
    </View>
  );
}
