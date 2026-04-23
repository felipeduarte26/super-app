import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AppEvents,
  Badge,
  Card,
  Section,
  colors,
  useEventBus,
  useTranslation,
} from '@super-app/core';
import {useProfile} from '../../hooks/useProfile';
import {darkTheme, createStyles} from './ProfileScreen.styles';

type ThemeChangedPayload = {mode?: 'light' | 'dark'} | undefined;

export function ProfileScreen() {
  const {user, loading, saving, error, fieldErrors, updateUser} = useProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  useEventBus<ThemeChangedPayload>(AppEvents.THEME_CHANGED, payload => {
    if (payload?.mode === 'dark') {
      setIsDarkTheme(true);
    } else if (payload?.mode === 'light') {
      setIsDarkTheme(false);
    } else {
      setIsDarkTheme(prev => !prev);
    }
  });

  useEffect(() => {
    if (user) {
      setName(user.displayName);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const theme = useMemo(
    () => ({
      background: isDarkTheme ? darkTheme.background : colors.background,
      surface: isDarkTheme ? darkTheme.surface : colors.surface,
      surfaceVariant: isDarkTheme
        ? darkTheme.surfaceVariant
        : colors.surfaceVariant,
      text: isDarkTheme ? darkTheme.text : colors.text,
      textSecondary: isDarkTheme ? darkTheme.textSecondary : colors.textSecondary,
      textDisabled: isDarkTheme ? darkTheme.textDisabled : colors.textDisabled,
      border: isDarkTheme ? darkTheme.border : colors.border,
      headerBg: isDarkTheme ? darkTheme.header : colors.primary,
      headerText: darkTheme.onPrimary,
      primary: colors.primary,
      primaryLight: isDarkTheme ? darkTheme.surfaceVariant : colors.primaryLight,
      error: colors.error,
    }),
    [isDarkTheme],
  );

  const styles = useMemo(() => createStyles(theme), [theme]);

  if (loading && !user) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingLabel, {color: theme.textSecondary}]}>
          {t('profile.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: theme.background}}
      contentContainerStyle={styles.root}>
      <View
        style={[
          styles.header,
          {backgroundColor: theme.headerBg, paddingTop: insets.top + 20},
        ]}>
        <View
          style={[
            styles.avatar,
            {backgroundColor: theme.primaryLight, borderColor: theme.headerText},
          ]}>
          <Text style={[styles.avatarText, {color: theme.primary}]}>
            {user?.avatarInitials ?? '—'}
          </Text>
        </View>
        <Text style={[styles.headerName, {color: theme.headerText}]}>
          {user?.displayName ?? ''}
        </Text>
        <Text style={[styles.headerEmail, {color: theme.headerText}]}>
          {user?.email ?? ''}
        </Text>
        {user ? (
          <Text style={[styles.memberSince, {color: theme.headerText}]}>
            {t('profile.member_since', {date: user.memberSinceFormatted})}
          </Text>
        ) : null}
      </View>

      <Section title={t('profile.section_profile')}>
        <Card style={[styles.demoCard, {backgroundColor: theme.surface}]}>
          <View style={styles.badgeRow}>
            <Badge label="CLEAN ARCHITECTURE" variant="success" />
            <Badge label="EVENT BUS" variant="warning" />
          </View>
          <Text style={[styles.demoText, {color: theme.textSecondary}]}>
            {t('profile.architecture_desc')}
          </Text>
        </Card>
      </Section>

      <Section title={t('profile.section_personal')}>
        <Card style={{backgroundColor: theme.surface}}>
          <Text style={[styles.label, {color: theme.textSecondary}]}>
            {t('profile.full_name')}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('profile.name_placeholder')}
            placeholderTextColor={theme.textDisabled}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: fieldErrors.name ? theme.error : theme.border,
                backgroundColor: theme.surfaceVariant,
              },
            ]}
            editable={!saving}
            autoCapitalize="words"
          />
          {fieldErrors.name ? (
            <Text style={styles.fieldError}>{fieldErrors.name}</Text>
          ) : null}

          <Text style={[styles.label, styles.labelSpaced, {color: theme.textSecondary}]}>
            {t('profile.email')}
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('profile.email_placeholder')}
            placeholderTextColor={theme.textDisabled}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: fieldErrors.email ? theme.error : theme.border,
                backgroundColor: theme.surfaceVariant,
              },
            ]}
            editable={!saving}
          />
          {fieldErrors.email ? (
            <Text style={styles.fieldError}>{fieldErrors.email}</Text>
          ) : null}

          <Text style={[styles.label, styles.labelSpaced, {color: theme.textSecondary}]}>
            {t('profile.bio')}
          </Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder={t('profile.bio_placeholder')}
            placeholderTextColor={theme.textDisabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.inputMultiline,
              {
                color: theme.text,
                borderColor: fieldErrors.bio ? theme.error : theme.border,
                backgroundColor: theme.surfaceVariant,
              },
            ]}
            editable={!saving}
          />
          <Text style={[styles.charCount, {color: theme.textDisabled}]}>
            {bio.length}/200
          </Text>
          {fieldErrors.bio ? (
            <Text style={styles.fieldError}>{fieldErrors.bio}</Text>
          ) : null}

          {error ? (
            <Text style={styles.fieldError}>{error.message}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.saveButton,
              {backgroundColor: theme.primary},
              saving && styles.saveButtonDisabled,
            ]}
            onPress={() => updateUser({name, email, bio})}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonLabel}>{t('profile.save')}</Text>
            )}
          </TouchableOpacity>
        </Card>
      </Section>

      <View style={styles.footerSpacer} />
    </ScrollView>
  );
}
