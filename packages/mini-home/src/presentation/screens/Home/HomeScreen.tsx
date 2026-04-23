import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Card,
  Badge,
  Section,
  EventBus,
  AppEvents,
  useEventBus,
  useTranslation,
} from '@super-app/core';
import {useNotifications} from '../../hooks/useNotifications';
import {NotificationCard} from '../../components/NotificationCard';
import {styles} from './HomeScreen.styles';

export function HomeScreen() {
  const {notifications, unreadCount, error} = useNotifications();
  const [profileName, setProfileName] = React.useState('Usuário');
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  useEventBus<{name: string}>(AppEvents.PROFILE_UPDATED, payload => {
    setProfileName(payload.name);
  });

  React.useEffect(() => {
    EventBus.emit(AppEvents.NOTIFICATION_BADGE_CHANGED, {count: unreadCount});
  }, [unreadCount]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, {paddingTop: insets.top + 16}]}>
        <Text style={styles.greeting}>
          {t('home.greeting', {name: profileName})}
        </Text>
        <Text style={styles.subtitle}>
          {unreadCount > 0
            ? t('home.unread_notifications', {count: unreadCount})
            : t('home.all_caught_up')}
        </Text>
      </View>

      <Section title={t('home.section_home')}>
        <Card>
          <Badge label="MODULE FEDERATION" variant="success" />
          <Text style={styles.infoText}>
            {t('home.module_federation_desc')}
          </Text>
        </Card>

        <Card>
          <Badge label="CLEAN ARCHITECTURE" variant="primary" />
          <Text style={styles.infoText}>
            {t('home.clean_architecture_desc')}
          </Text>
        </Card>

        <Card>
          <Badge label="EVENT BUS" variant="warning" />
          <Text style={styles.infoText}>{t('home.event_bus_desc')}</Text>
        </Card>
      </Section>

      <Section title={t('home.section_notifications')}>
        {error ? (
          <Card>
            <Text style={styles.errorText}>{error.message}</Text>
          </Card>
        ) : (
          notifications.map(item => (
            <NotificationCard key={item.id} item={item} />
          ))
        )}
      </Section>
    </ScrollView>
  );
}
