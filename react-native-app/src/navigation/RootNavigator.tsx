import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from './types';
import { useApp } from '../context/AppContext';
import {
  SetupScreen,
  FeedScreen,
  DetailScreen,
  AboutScreen,
  LibrariesScreen,
} from '../screens';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { selectedSource, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={selectedSource ? 'Feed' : 'Setup'}
      screenOptions={{
        headerBackTitle: '',
      }}
    >
      <Stack.Screen
        name="Setup"
        component={SetupScreen}
        options={{ title: 'Select Source' }}
      />
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={({ route }) => ({ title: route.params?.source?.title || 'Feed' })}
        initialParams={selectedSource ? { source: selectedSource } : undefined}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.item?.title || 'Article' })}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About' }}
      />
      <Stack.Screen
        name="Libraries"
        component={LibrariesScreen}
        options={{ title: 'Used Libraries' }}
      />
    </Stack.Navigator>
  );
}
