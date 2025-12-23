import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { ScreenState } from '../models/types';

interface LoadingWrapperProps<T> {
  state: ScreenState<T>;
  children: (data: T) => React.ReactNode;
}

export function LoadingWrapper<T>({ state, children }: LoadingWrapperProps<T>) {
  if (state.status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (state.status === 'error' && !state.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorDetail}>{state.error.message}</Text>
      </View>
    );
  }

  // Show data (either loaded or cached from error state)
  const data = state.status === 'loaded' ? state.data : state.data!;
  return <>{children(data)}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
