import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface Library {
  id: string;
  name: string;
  license: string;
}

const libraries: Library[] = [
  { id: '1', name: '@react-navigation/native', license: 'MIT' },
  { id: '2', name: '@react-navigation/stack', license: 'MIT' },
  { id: '3', name: 'react-native-webview', license: 'MIT' },
  { id: '4', name: 'rss-parser', license: 'MIT' },
  { id: '5', name: '@react-native-async-storage/async-storage', license: 'MIT' },
  { id: '6', name: 'expo-web-browser', license: 'MIT' },
];

export function LibrariesScreen() {
  const renderItem = ({ item }: { item: Library }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.license}>{item.license}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={libraries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
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
    backgroundColor: '#e0e0e0',
  },
});
