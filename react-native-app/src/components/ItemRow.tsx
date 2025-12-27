import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { RssItem } from '../models/types';


interface ItemRowProps {
  item: RssItem;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ItemRow({ item, onPress, isFirst, isLast }: ItemRowProps) {
  const containerStyle: ViewStyle[] = [styles.container];
  if (isFirst) containerStyle.push(styles.firstItem);
  if (isLast) containerStyle.push(styles.lastItem);

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#3c3c43',
  },
  chevron: {
    fontSize: 18,
    color: '#c7c7cc',
    marginLeft: 8,
  },
});
