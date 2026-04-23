import React from 'react';
import {ScrollView} from 'react-native';
import {HomeScreen} from './presentation/screens/Home/HomeScreen';

export default function HomeNavigator() {
  return (
    <ScrollView>
      <HomeScreen />
    </ScrollView>
  );
}
