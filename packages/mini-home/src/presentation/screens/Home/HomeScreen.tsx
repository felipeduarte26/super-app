import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Card,
  Badge,
  Section,
  EventBus,
  AppEvents,
  useOn,
  useTranslation,
} from '@super-app/core';
import {useNotifications} from '../../hooks/useNotifications';
import {NotificationCard} from '../../components/NotificationCard';
import {styles} from './HomeScreen.styles';

interface ProfileSummary {
  displayName: string;
  email: string;
  avatarInitials: string;
}

export function HomeScreen() {
  const {notifications, unreadCount, error} = useNotifications();
  const [profileName, setProfileName] = React.useState('Usuário');
  const [profileSummary, setProfileSummary] =
    React.useState<ProfileSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = React.useState(false);
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  useOn(AppEvents.PROFILE_UPDATED, payload => {
    setProfileName(payload.name);
    setProfileSummary(null);
  });

  React.useEffect(() => {
    EventBus.emit(AppEvents.NOTIFICATION_BADGE_CHANGED, {count: unreadCount});
  }, [unreadCount]);

  const fetchProfileSummary = React.useCallback(async () => {
    setLoadingSummary(true);
    try {
      const summary = await EventBus.request<
        Record<string, never>,
        ProfileSummary | null
      >('profile:get_summary', {}, 5000);
      setProfileSummary(summary);
    } catch {
      setProfileSummary(null);
    }
    setLoadingSummary(false);
  }, []);

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

      <Section title={t('home.section_request_response')}>
        <Card>
          <View style={styles.badgeRow}>
            <Badge label="REQUEST / RESPONSE" variant="primary" />
            <Badge label="CROSS-MODULE" variant="warning" />
          </View>
          <Text style={styles.infoText}>
            {t('home.request_response_desc')}
          </Text>

          <TouchableOpacity
            style={styles.requestButton}
            onPress={fetchProfileSummary}
            disabled={loadingSummary}>
            {loadingSummary ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.requestButtonText}>
                {t('home.request_profile_button')}
              </Text>
            )}
          </TouchableOpacity>

          {profileSummary ? (
            <View style={styles.summaryCard}>
              <View style={styles.summaryAvatar}>
                <Text style={styles.summaryAvatarText}>
                  {profileSummary.avatarInitials}
                </Text>
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryName}>
                  {profileSummary.displayName}
                </Text>
                <Text style={styles.summaryEmail}>
                  {profileSummary.email}
                </Text>
              </View>
              <Badge label="VIA EVENT BUS" variant="success" />
            </View>
          ) : null}
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
