import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {colors} from '@super-app/core';
import {styles} from './MiniAppLoader.styles';

interface MiniAppLoaderProps {
  name: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class MiniAppErrorBoundary extends React.Component<
  {name: string; children: React.ReactNode},
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {hasError: false, error: null};

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {hasError: true, error};
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>
            Mini App "{this.props.name}" falhou
          </Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message ?? 'Erro desconhecido'}
          </Text>
          <Text style={styles.errorHint}>
            Em produção, o Host App faria rollback para a versão anterior deste
            módulo automaticamente.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function LoadingFallback({name}: {name: string}) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Carregando {name}...</Text>
      <Text style={styles.loadingHint}>
        Module Federation — carregamento remoto
      </Text>
    </View>
  );
}

export function MiniAppLoader({name, children}: MiniAppLoaderProps) {
  return (
    <MiniAppErrorBoundary name={name}>
      <React.Suspense fallback={<LoadingFallback name={name} />}>
        {children}
      </React.Suspense>
    </MiniAppErrorBoundary>
  );
}
