import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
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

  useEffect(() => {
    // Set header buttons - "+" on left (matches SwiftUI), "Next" on right
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.headerButton}
          accessibilityLabel="Add source"
          testID="add-source-button"
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleNext}
          style={styles.headerButton}
          disabled={!selected}
          accessibilityLabel="Next"
          testID="next-button"
        >
          <Text style={[styles.headerButtonText, !selected && styles.headerButtonDisabled]}>
            Next
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selected]);

  const handleSelect = (source: RssSource) => {
    setSelected(source);
  };

  const handleNext = async () => {
    if (!selected) {
      Alert.alert('Error', 'Please select a source');
      return;
    }

    await setSelectedSource(selected);
    navigation.navigate('Feed', { source: selected });
  };

  const handleAddSource = (source: RssSource) => {
    setSources([...sources, source]);
  };

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
  headerButton: {
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#007AFF',
  },
  addButtonText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#000', // Black like SwiftUI
  },
  headerButtonDisabled: {
    color: '#ccc',
  },
});
