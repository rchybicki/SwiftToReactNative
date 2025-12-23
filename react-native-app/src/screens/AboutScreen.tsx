import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
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

  const items: AboutItem[] = [
    {
      id: 'author',
      title: 'Author Blog',
      subtitle: 'blog.kulman.sk',
      action: () => WebBrowser.openBrowserAsync('https://blog.kulman.sk'),
    },
    {
      id: 'libraries',
      title: 'Used Libraries',
      action: () => navigation.navigate('Libraries'),
    },
  ];

  const renderItem = ({ item }: { item: AboutItem }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={item.action}
      disabled={!item.action}
    >
      <View>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
      </View>
      {item.action && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.appName}>RSS Reader</Text>
        <Text style={styles.version}>
          Version {appVersion} ({buildNumber})
        </Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 20,
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
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
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
    color: '#ccc',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});
