import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface Library {
  id: string;
  name: string;
  license: string;
}

const libraries: Library[] = [
  { id: '1', name: '@react-navigation/native', license: 'MIT' },
  { id: '2', name: '@react-navigation/native-stack', license: 'MIT' },
  { id: '3', name: 'react-native-webview', license: 'MIT' },
  { id: '4', name: 'react-native-rss-parser', license: 'MIT' },
  { id: '5', name: '@react-native-async-storage/async-storage', license: 'MIT' },
  { id: '6', name: 'expo-web-browser', license: 'MIT' },
];

export function LibrariesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        {libraries.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <View style={styles.separator} />}
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.license}>{item.license}</Text>
            </View>
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
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  license: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#c6c6c8',
    marginLeft: 16,
  },
});
