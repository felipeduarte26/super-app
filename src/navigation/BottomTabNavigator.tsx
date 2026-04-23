import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  colors,
  AppEvents,
  useOn,
  useTranslation,
  type TranslationKeys,
} from '@super-app/core';
import {getMiniApps, type MiniAppRegistry} from '../config/miniApps';
import {MiniAppLoader} from './MiniAppLoader';
import {styles} from './BottomTabNavigator.styles';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  home: '🏠',
  profile: '👤',
  settings: '⚙️',
};

const TAB_I18N_KEYS: Record<string, keyof TranslationKeys> = {
  home: 'tab.home',
  profile: 'tab.profile',
  settings: 'tab.settings',
};

function buildTabScreen(app: MiniAppRegistry): React.ComponentType {
  const NavigatorComponent = app.getNavigator();
  const {displayName} = app.manifest;

  function TabScreen() {
    return (
      <MiniAppLoader name={displayName}>
        <NavigatorComponent />
      </MiniAppLoader>
    );
  }

  TabScreen.displayName = `TabScreen(${app.manifest.name})`;
  return TabScreen;
}

function TabIcon({
  name,
  focused,
  badgeCount,
}: {
  name: string;
  focused: boolean;
  badgeCount: number;
}) {
  const icon = TAB_ICONS[name] ?? '📦';

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      {name === 'home' && badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </View>
  );
}

export function BottomTabNavigator() {
  const [badgeCount, setBadgeCount] = React.useState(0);
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  useOn(AppEvents.NOTIFICATION_BADGE_CHANGED, payload => {
    setBadgeCount(payload.count);
  });

  const tabs = useMemo(() => {
    return getMiniApps().map(app => ({
      key: app.manifest.name,
      manifest: app.manifest,
      Screen: buildTabScreen(app),
    }));
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {paddingBottom: 8 + insets.bottom, height: 60 + insets.bottom},
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      {tabs.map(({key, manifest, Screen}) => (
        <Tab.Screen
          key={key}
          name={key}
          component={Screen}
          options={{
            tabBarLabel: TAB_I18N_KEYS[key]
              ? t(TAB_I18N_KEYS[key])
              : manifest.displayName,
            tabBarIcon: ({focused}) => (
              <TabIcon name={key} focused={focused} badgeCount={badgeCount} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
