import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SetupScreenNavigationProp } from '../navigation/types';
import { RssSource } from '../models/types';
import { SourceRow, AddSourceModal } from '../components';
import { useApp } from '../context/AppContext';
import sourcesData from '../../assets/sources.json';

export function SetupScreen() {
  const navigation = useNavigation<SetupScreenNavigationProp>();
  const { selectedSource, setSelectedSource } = useApp();
  const [sources, setSources] = useState<RssSource[]>([]);
  const [selected, setSelected] = useState<RssSource | null>(selectedSource);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Load sources from JSON
    setSources(sourcesData as RssSource[]);
  }, []);

  const handleSelect = (source: RssSource) => {
    setSelected(source);
  };

  const handleNext = useCallback(async () => {
    if (!selected) {
      Alert.alert('Error', 'Please select a source');
      return;
    }

    await setSelectedSource(selected);
    navigation.navigate('Feed', { source: selected });
  }, [selected, setSelectedSource, navigation]);

  const handleAddSource = (source: RssSource) => {
    setSources((prev) => [...prev, source]);
    setShowAddModal(false);
  };

  useEffect(() => {
    // Set header buttons - "+" on left (matches SwiftUI), "Next" on right
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.headerIconButton}
          accessibilityLabel="Add source"
          testID="add-source-button"
        >
          <Ionicons name="add" size={22} color="#000000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.headerPill, !selected && styles.headerPillDisabled]}
          disabled={!selected}
          accessibilityLabel="Next"
          testID="next-button"
        >
          <Text style={[styles.headerPillText, !selected && styles.headerPillTextDisabled]}>
            Next
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selected, handleNext]);

  const renderItem = ({ item, index }: { item: RssSource; index: number }) => (
    <SourceRow
      source={item}
      isSelected={selected?.rss === item.rss}
      onPress={() => handleSelect(item)}
      isFirst={index === 0}
      isLast={index === sources.length - 1}
    />
  );

  return (
    <>
      <FlatList
        data={sources}
        renderItem={renderItem}
        keyExtractor={(item) => item.rss}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        style={styles.container}
        testID="setup-screen"
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={<View style={styles.listTop} />}
        ListFooterComponent={<View style={styles.listBottom} />}
      />
      <AddSourceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSource}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7', // iOS system grouped background
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listTop: {
    height: 20,
  },
  listBottom: {
    height: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#c6c6c8',
    marginLeft: 60, // Inset separator like iOS
  },
  headerIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  headerPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginRight: 4,
  },
  headerPillDisabled: {
    backgroundColor: '#e5e5ea',
  },
  headerPillText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerPillTextDisabled: {
    color: '#8e8e93',
  },
});
