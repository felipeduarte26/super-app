import React from 'react';
import {View, ViewProps} from 'react-native';
import {styles} from './Card.styles';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({children, style, ...props}: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}
