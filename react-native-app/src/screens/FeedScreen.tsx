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

  // Set header buttons - gear on left (matches SwiftUI), info on right
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleSettings}
          style={styles.headerButton}
          accessibilityLabel="Settings"
          testID="settings-button"
        >
          <Text style={styles.headerButtonText}>⚙</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('About')}
          style={styles.headerButton}
          accessibilityLabel="About"
          testID="info-button"
        >
          <Text style={styles.headerButtonText}>ℹ️</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSettings = async () => {
    await setSelectedSource(null);
    // Pop back to Setup (like SwiftUI), don't push a new screen
    navigation.goBack();
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
    backgroundColor: '#f2f2f7', // iOS system grouped background
  },
  separator: {
    height: 1,
    backgroundColor: '#c6c6c8',
    marginLeft: 16,
  },
  headerButton: {
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: 20,
  },
});
