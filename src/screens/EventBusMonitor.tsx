import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EventBus} from '@super-app/core';
import {styles} from './EventBusMonitor.styles';

interface EventLog {
  id: number;
  event: string;
  payload: string;
  timestamp: string;
}

let nextId = 1;

export function EventBusMonitor() {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggle = useCallback(() => {
    const toValue = visible ? 0 : 1;
    setVisible(!visible);
    Animated.timing(fadeAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  React.useEffect(() => {
    const originalEmit = EventBus.emit.bind(EventBus);
    const wrappedEmit = <T,>(event: string, payload?: T) => {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setLogs(prev => [
        {
          id: nextId++,
          event,
          payload: payload ? JSON.stringify(payload) : '—',
          timestamp: time,
        },
        ...prev.slice(0, 49),
      ]);

      originalEmit(event, payload);
    };

    EventBus.emit = wrappedEmit;
    return () => {
      EventBus.emit = originalEmit;
    };
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={toggle}
        accessibilityLabel="Toggle Event Bus monitor">
        <Text style={styles.fabText}>📡</Text>
      </TouchableOpacity>

      {visible && (
        <Animated.View style={[styles.panel, {opacity: fadeAnim}]}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Event Bus Monitor</Text>
            <TouchableOpacity onPress={() => setLogs([])}>
              <Text style={styles.clearBtn}>Limpar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.logList}>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhum evento capturado. Interaja com os Mini Apps.
              </Text>
            ) : (
              logs.map(log => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logRow}>
                    <Text style={styles.logTime}>{log.timestamp}</Text>
                    <Text style={styles.logEvent}>{log.event}</Text>
                  </View>
                  <Text style={styles.logPayload}>{log.payload}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </Animated.View>
      )}
    </>
  );
}
