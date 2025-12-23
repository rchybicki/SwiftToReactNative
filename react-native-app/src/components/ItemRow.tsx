import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RssItem } from '../models/types';

interface ItemRowProps {
  item: RssItem;
  onPress: () => void;
}

export function ItemRow({ item, onPress }: ItemRowProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      {item.description && (
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
