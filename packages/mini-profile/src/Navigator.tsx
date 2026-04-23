import React from 'react';
import {ScrollView} from 'react-native';
import {ProfileScreen} from './presentation/screens/Profile/ProfileScreen';
import {styles} from './Navigator.styles';

export default function ProfileNavigator() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      style={styles.scroll}>
      <ProfileScreen />
    </ScrollView>
  );
}
