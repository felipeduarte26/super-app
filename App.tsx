import React from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {BottomTabNavigator} from './src/navigation/BottomTabNavigator';
import {EventBusMonitor} from './src/screens/EventBusMonitor';
import {bootstrapMiniApps} from './src/config/bootstrap';
import {styles} from './App.styles';

bootstrapMiniApps();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <View style={styles.root}>
          <BottomTabNavigator />
          <EventBusMonitor />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
