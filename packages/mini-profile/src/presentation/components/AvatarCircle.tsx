import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './AvatarCircle.styles';

interface AvatarCircleProps {
  initials: string;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

export function AvatarCircle({
  initials,
  size = 88,
  backgroundColor,
  borderColor,
  textColor,
}: AvatarCircleProps) {
  const dynamicContainer = {
    width: size,
    height: size,
    borderRadius: size / 2,
    ...(backgroundColor ? {backgroundColor} : {}),
    ...(borderColor ? {borderColor} : {}),
  };

  const dynamicText = {
    fontSize: size * 0.32,
    ...(textColor ? {color: textColor} : {}),
  };

  return (
    <View style={[styles.container, dynamicContainer]}>
      <Text style={[styles.initials, dynamicText]}>{initials}</Text>
    </View>
  );
}
