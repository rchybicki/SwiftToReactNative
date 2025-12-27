import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { DetailScreenRouteProp } from '../navigation/types';

export function DetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const { item } = route.params;

  return (
    <WebView
      source={{ uri: item.link }}
      style={styles.container}
      startInLoadingState={true}
      testID="detail-webview"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
