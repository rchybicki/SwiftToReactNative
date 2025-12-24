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
import { AboutScreenNavigationProp } from '../navigation/types';
import Constants from 'expo-constants';

interface AboutItem {
  id: string;
  title: string;
  subtitle?: string;
  action?: () => void;
}

export function AboutScreen() {
  const navigation = useNavigation<AboutScreenNavigationProp>();

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  // Order matches SwiftUI: Used libraries first, then Author's blog
  const items: AboutItem[] = [
    {
      id: 'libraries',
      title: 'Used Libraries',
      action: () => navigation.navigate('Libraries'),
    },
    {
      id: 'author',
      title: "Author's Blog",
      subtitle: 'blog.kulman.sk',
      action: () => WebBrowser.openBrowserAsync('https://blog.kulman.sk'),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header card with logo */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.appName}>RSS Reader</Text>
          <Text style={styles.version}>
            Version {appVersion} ({buildNumber})
          </Text>
        </View>
      </View>

      {/* Menu items card */}
      <View style={styles.card}>
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
              <View>
                <Text style={styles.title}>{item.title}</Text>
                {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
              </View>
              {item.action && <Text style={styles.chevron}>›</Text>}
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
    paddingVertical: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  version: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#c7c7cc',
  },
  separator: {
    height: 1,
    backgroundColor: '#c6c6c8',
    marginLeft: 16,
  },
});
