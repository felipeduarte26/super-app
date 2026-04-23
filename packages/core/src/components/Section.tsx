import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './Section.styles';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({title, children}: SectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}
