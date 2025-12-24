import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { useApp } from '../context/AppContext';
import {
  SetupScreen,
  FeedScreen,
  DetailScreen,
  AboutScreen,
  LibrariesScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
}

export function RootNavigator({ navigationRef }: RootNavigatorProps) {
  const { selectedSource, isLoading } = useApp();
  const hasNavigatedToFeed = useRef(false);

  // Like SwiftUI Coordinator: if source exists, push Feed on top of Setup
  useEffect(() => {
    if (!isLoading && selectedSource && !hasNavigatedToFeed.current) {
      // Small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        navigationRef.current?.navigate('Feed', { source: selectedSource });
        hasNavigatedToFeed.current = true;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoading, selectedSource, navigationRef]);

  // Reset flag when source is cleared
  useEffect(() => {
    if (!selectedSource) {
      hasNavigatedToFeed.current = false;
    }
  }, [selectedSource]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Setup"
      screenOptions={{
        headerBackTitle: '',
        gestureEnabled: true,
        // Native iOS animations are automatic with native-stack
      }}
    >
      <Stack.Screen
        name="Setup"
        component={SetupScreen}
        options={{
          title: 'Select source',
          headerLargeTitle: true, // Large title like SwiftUI
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={({ route }) => ({
          title: route.params?.source?.title || 'Feed',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          // Hide back button since we use gear icon for settings
          headerBackVisible: false,
        })}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params?.item?.title || 'Article',
        })}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Libraries"
        component={LibrariesScreen}
        options={{
          title: 'Used Libraries',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
