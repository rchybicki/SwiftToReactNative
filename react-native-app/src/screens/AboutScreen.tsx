import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { AboutScreenNavigationProp } from '../navigation/types';
import Constants from 'expo-constants';

interface AboutItem {
  id: string;
  title: string;
  action?: () => void;
}

export function AboutScreen() {
  const navigation = useNavigation<AboutScreenNavigationProp>();
  const headerHeight = useHeaderHeight();

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';
  const normalizedVersion = (() => {
    const parts = appVersion.split('.');
    if (parts.length === 3 && parts[2] === '0') {
      return `${parts[0]}.${parts[1]}`;
    }
    return appVersion;
  })();
  const appName = 'RSS Reader (RN)';

  // Order matches SwiftUI: Used libraries first, then Author's blog
  const items: AboutItem[] = [
    {
      id: 'libraries',
      title: 'Used libraries',
      action: () => navigation.navigate('Libraries'),
    },
    {
      id: 'author',
      title: "Author's blog",
      action: () => WebBrowser.openBrowserAsync('https://blog.kulman.sk'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: headerHeight + 8 },
      ]}
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.version}>
            {normalizedVersion} ({buildNumber})
          </Text>
        </View>
        <View style={styles.separator} />
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <View style={styles.separator} />}
            <TouchableOpacity
              style={styles.row}
              onPress={item.action}
              disabled={!item.action}
              accessibilityLabel={item.title}
              testID={`about-item-${item.id}`}
            >
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7', // iOS system grouped background
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerRow: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  icon: {
    width: 96,
    height: 96,
    marginBottom: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#c6c6c8',
    marginLeft: 16,
  },
});
