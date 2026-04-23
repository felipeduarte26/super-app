import React from 'react';
import {ScrollView} from 'react-native';
import {SettingsScreen} from './presentation/screens/Settings/SettingsScreen';
import {styles} from './Navigator.styles';

export default function SettingsNavigator() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      style={styles.scroll}>
      <SettingsScreen />
    </ScrollView>
  );
}
