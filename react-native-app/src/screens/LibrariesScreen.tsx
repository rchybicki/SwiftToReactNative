import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

interface Library {
  id: string;
  name: string;
  license: string;
}

const libraries: Library[] = [
  { id: '1', name: 'FeedKit', license: 'MIT License' },
  { id: '2', name: 'SwiftLint', license: 'MIT License' },
];

export function LibrariesScreen() {
  const headerHeight = useHeaderHeight();

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
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 16,
  },
  license: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#c6c6c8',
    marginLeft: 16,
  },
});
