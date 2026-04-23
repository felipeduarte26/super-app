import React from 'react';
import {Text, View} from 'react-native';
import {Card, Badge} from '@super-app/core';
import type {NotificationViewModel} from '../../application/viewModels/NotificationViewModel';
import {styles} from './NotificationCard.styles';

const BADGE_VARIANT = {
  info: 'primary' as const,
  success: 'success' as const,
  warning: 'warning' as const,
  promo: 'primary' as const,
};

interface NotificationCardProps {
  item: NotificationViewModel;
}

export function NotificationCard({item}: NotificationCardProps) {
  return (
    <Card style={item.isUnread ? styles.unreadCard : undefined}>
      <View style={styles.header}>
        <Badge
          label={item.type.toUpperCase()}
          variant={BADGE_VARIANT[item.type] ?? 'primary'}
        />
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </Card>
  );
}
