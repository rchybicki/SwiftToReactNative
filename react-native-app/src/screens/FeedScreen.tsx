import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FeedScreenNavigationProp, FeedScreenRouteProp } from '../navigation/types';
import { RssItem } from '../models/types';
import { useLoadableState } from '../hooks/useLoadableState';
import { fetchFeed } from '../services/feed';
import { ItemRow, LoadingWrapper } from '../components';
import { useApp } from '../context/AppContext';

export function FeedScreen() {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const route = useRoute<FeedScreenRouteProp>();
  const { source } = route.params;
  const { setSelectedSource } = useApp();
  const { state, setLoading, setLoaded, setError, isLoading, error, clearError } = useLoadableState<RssItem[]>();

  const loadFeed = useCallback(async () => {
    setLoading();
    try {
      const items = await fetchFeed(source);
      setLoaded(items);
    } catch (err) {
      setError(err as Error, state.status === 'loaded' ? state.data : undefined);
    }
  }, [source, setLoading, setLoaded, setError]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error.message, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  // Set header buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('About')}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>i</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSettings}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>⚙</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleSettings = async () => {
    await setSelectedSource(null);
    navigation.navigate('Setup');
  };

  const handleItemPress = (item: RssItem) => {
    navigation.navigate('Detail', { item });
  };

  const renderItem = ({ item }: { item: RssItem }) => (
    <ItemRow item={item} onPress={() => handleItemPress(item)} />
  );

  return (
    <View style={styles.container}>
      <LoadingWrapper state={state}>
        {(items) => (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.link}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={loadFeed} />
            }
          />
        )}
      </LoadingWrapper>
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
    paddingHorizontal: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
});
