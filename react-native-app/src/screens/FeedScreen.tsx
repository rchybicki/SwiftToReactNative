import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FeedScreenNavigationProp, FeedScreenRouteProp } from '../navigation/types';
import { RssItem } from '../models/types';
import { useLoadableState } from '../hooks/useLoadableState';
import { fetchFeed, FeedError } from '../services/feed';
import { ItemRow, LoadingWrapper } from '../components';
import { useApp } from '../context/AppContext';

export function FeedScreen() {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const route = useRoute<FeedScreenRouteProp>();
  const { source } = route.params;
  const { setSelectedSource } = useApp();
  const { state, setLoading, setLoaded, setError, isLoading, error, clearError } = useLoadableState<RssItem[]>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const loadFeed = useCallback(async (options?: { refresh?: boolean }) => {
    const isRefresh = options?.refresh ?? false;
    if (!isRefresh) {
      setLoading();
    }
    try {
      const items = await fetchFeed(source);
      setLoaded(items);
    } catch (err) {
      const cachedData = stateRef.current.status === 'loaded' ? stateRef.current.data : undefined;
      setError(err as Error, cachedData);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      }
    }
  }, [source, setLoading, setLoaded, setError]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Show error alert
  useEffect(() => {
    if (error) {
      const title = error instanceof FeedError ? error.message : 'Error';
      const message = error instanceof FeedError ? error.recoverySuggestion ?? '' : error.message;
      Alert.alert(title, message || undefined, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const handleSettings = useCallback(() => {
    // Don't block UI on storage writes; navigate back immediately.
    void setSelectedSource(null);
    // Ensure we land on Setup even if stack state is unexpected.
    navigation.reset({
      index: 0,
      routes: [{ name: 'Setup' }],
    });
  }, [setSelectedSource, navigation]);

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
          <Ionicons name="settings-outline" size={22} color="#000000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('About')}
          style={styles.headerButton}
          accessibilityLabel="About"
          testID="info-button"
        >
          <Ionicons name="information-circle-outline" size={22} color="#000000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSettings]);

  const handleItemPress = (item: RssItem) => {
    navigation.navigate('Detail', { item });
  };

  return (
    <View style={styles.container} testID="feed-screen">
      <LoadingWrapper state={state}>
        {(items) => (
          <FlatList
            data={items}
            renderItem={({ item, index }) => (
              <ItemRow
                item={item}
                onPress={() => handleItemPress(item)}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
            )}
            keyExtractor={(item) => item.link}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            contentInsetAdjustmentBehavior="automatic"
            ListHeaderComponent={<View style={styles.listTop} />}
            ListFooterComponent={<View style={styles.listBottom} />}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  setIsRefreshing(true);
                  void loadFeed({ refresh: true });
                }}
              />
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
    marginLeft: 16,
  },
  headerButton: {
    paddingHorizontal: 12,
  },
});
