import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RssSource } from '../models/types';

interface SourceRowProps {
  source: RssSource;
  isSelected: boolean;
  onPress: () => void;
}

export function SourceRow({ source, isSelected, onPress }: SourceRowProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        {source.icon ? (
          <Image source={{ uri: source.icon }} style={styles.icon} />
        ) : (
          <View style={[styles.icon, styles.placeholderIcon]} />
        )}
      </View>
      <Text style={styles.title}>{source.title}</Text>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  placeholderIcon: {
    backgroundColor: '#e0e0e0',
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
  },
});
