import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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
    return <View style={styles.empty} />;
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
  empty: {
    flex: 1,
  },
});
