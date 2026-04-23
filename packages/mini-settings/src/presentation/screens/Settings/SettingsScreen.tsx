import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Badge,
  Card,
  Section,
  colors,
  useTranslation,
} from '@super-app/core';
import {useSettings} from '../../hooks/useSettings';
import {darkTheme, createStyles} from './SettingsScreen.styles';

export function SettingsScreen() {
  const {
    settings,
    loading,
    updating,
    error,
    updateSettings,
    resetToDefaults,
  } = useSettings();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  const isDark = settings?.isDarkMode ?? false;

  const theme = useMemo(
    () => ({
      background: isDark ? darkTheme.background : colors.background,
      surface: isDark ? darkTheme.surface : colors.surface,
      surfaceVariant: isDark
        ? darkTheme.surfaceVariant
        : colors.surfaceVariant,
      text: isDark ? darkTheme.text : colors.text,
      textSecondary: isDark ? darkTheme.textSecondary : colors.textSecondary,
      textDisabled: isDark ? darkTheme.textDisabled : colors.textDisabled,
      border: isDark ? darkTheme.border : colors.border,
      divider: isDark ? darkTheme.divider : colors.divider,
      primary: colors.primary,
      primaryLight: isDark ? darkTheme.surfaceVariant : colors.primaryLight,
      success: colors.success,
      error: colors.error,
    }),
    [isDark],
  );

  const styles = useMemo(() => createStyles(theme), [theme]);
  const languages = settings?.availableLanguages ?? [];

  if (loading || !settings) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: theme.background}}
      contentContainerStyle={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <Text style={styles.headerIcon}>⚙️</Text>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('settings.subtitle')}</Text>
      </View>

      {error ? (
        <Card style={[styles.errorCard, {borderColor: theme.error}]}>
          <Text style={[styles.errorText, {color: theme.error}]}>
            {error.message}
          </Text>
        </Card>
      ) : null}

      <Section title={t('settings.section_appearance')}>
        <Card style={styles.cardInner}>
          <View style={styles.row}>
            <View style={styles.rowIconWrap}>
              <Text style={styles.rowEmoji}>🌙</Text>
            </View>
            <View style={styles.rowBody}>
              <View style={styles.rowTitleRow}>
                <Text style={styles.rowTitle}>{t('settings.dark_theme')}</Text>
                <Badge label="EVENT BUS" variant="warning" />
              </View>
              <Text style={styles.rowHint}>
                {t('settings.dark_theme_hint')}
              </Text>
            </View>
            <Switch
              accessibilityLabel={t('settings.dark_theme')}
              value={settings.theme === 'dark'}
              onValueChange={value =>
                updateSettings({theme: value ? 'dark' : 'light'})
              }
              disabled={updating}
              trackColor={{false: theme.border, true: theme.primaryLight}}
              thumbColor={settings.theme === 'dark' ? theme.primary : '#f4f3f4'}
            />
          </View>
        </Card>
      </Section>

      <Section title={t('settings.section_language')}>
        <Card style={styles.cardInner}>
          <View style={styles.langHeaderRow}>
            <Text style={styles.rowEmoji}>🌐</Text>
            <Badge label="EVENT BUS" variant="warning" />
          </View>
          <Text style={styles.sectionHint}>
            {t('settings.language_hint')}
          </Text>
          {languages.map((lang, index) => (
            <View key={lang.code}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <TouchableOpacity
                style={styles.langRow}
                onPress={() => updateSettings({language: lang.code})}
                disabled={updating}
                accessibilityRole="button"
                accessibilityState={{selected: settings.languageCode === lang.code}}>
                <Text style={styles.langLabel}>{lang.label}</Text>
                <Text style={styles.langCode}>{lang.code}</Text>
                {settings.languageCode === lang.code ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <View style={styles.checkPlaceholder} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      </Section>

      <Section title={t('settings.section_notifications')}>
        <Card style={styles.cardInner}>
          <View style={styles.row}>
            <View style={styles.rowIconWrap}>
              <Text style={styles.rowEmoji}>🔔</Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>
                {t('settings.push_notifications')}
              </Text>
              <Text style={styles.rowHint}>{t('settings.push_hint')}</Text>
            </View>
            <Switch
              accessibilityLabel={t('settings.push_notifications')}
              value={settings.notificationsEnabled}
              onValueChange={value =>
                updateSettings({notificationsEnabled: value})
              }
              disabled={updating}
              trackColor={{false: theme.border, true: theme.primaryLight}}
              thumbColor={
                settings.notificationsEnabled ? theme.primary : '#f4f3f4'
              }
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowIconWrap}>
              <Text style={styles.rowEmoji}>📱</Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>
                {t('settings.biometric_login')}
              </Text>
              <Text style={styles.rowHint}>
                {t('settings.biometric_hint')}
              </Text>
            </View>
            <Switch
              accessibilityLabel={t('settings.biometric_login')}
              value={settings.biometricEnabled}
              onValueChange={value =>
                updateSettings({biometricEnabled: value})
              }
              disabled={updating}
              trackColor={{false: theme.border, true: theme.primaryLight}}
              thumbColor={
                settings.biometricEnabled ? theme.primary : '#f4f3f4'
              }
            />
          </View>
        </Card>
      </Section>

      <Section title={t('settings.section_about')}>
        <Card style={styles.cardInner}>
          <Text style={styles.aboutLabel}>
            {t('settings.installed_version')}
          </Text>
          <View style={styles.versionRow}>
            <Text style={styles.versionValue}>{settings.appVersion}</Text>
            <Badge label="POC" variant="primary" />
          </View>
          <Text style={styles.aboutFootnote}>
            {t('settings.about_footnote')}
          </Text>
        </Card>
      </Section>

      <TouchableOpacity
        style={[styles.resetButton, updating && styles.resetDisabled]}
        onPress={resetToDefaults}
        disabled={updating}
        accessibilityRole="button"
        accessibilityLabel={t('settings.reset_defaults')}>
        <Text style={styles.resetButtonText}>
          {t('settings.reset_defaults')}
        </Text>
      </TouchableOpacity>

      {updating ? (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      ) : null}
    </ScrollView>
  );
}
