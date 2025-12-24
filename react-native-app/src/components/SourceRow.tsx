import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { RssSource } from '../models/types';

interface SourceRowProps {
  source: RssSource;
  isSelected: boolean;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SourceRow({ source, isSelected, onPress, isFirst, isLast }: SourceRowProps) {
  const containerStyle: ViewStyle[] = [styles.container];
  if (isFirst) containerStyle.push(styles.firstItem);
  if (isLast) containerStyle.push(styles.lastItem);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={source.title}
      accessibilityState={{ selected: isSelected }}
      testID={`source-row-${source.title.toLowerCase().replace(/\s+/g, '-')}`}
    >
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
  firstItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastItem: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
    color: '#000', // Black like SwiftUI SF Symbol default
  },
});
