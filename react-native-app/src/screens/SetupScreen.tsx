import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
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
    // Set header buttons
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={styles.headerButton}
            disabled={!selected}
          >
            <Text style={[styles.headerButtonText, !selected && styles.headerButtonDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
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

  const renderItem = ({ item }: { item: RssSource }) => (
    <SourceRow
      source={item}
      isSelected={selected?.rss === item.rss}
      onPress={() => handleSelect(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sources}
        renderItem={renderItem}
        keyExtractor={(item) => item.rss}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <AddSourceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSource}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#007AFF',
  },
  headerButtonDisabled: {
    color: '#ccc',
  },
});
