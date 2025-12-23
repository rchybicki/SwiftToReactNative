import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RssSource, RssItem } from '../models/types';

export type RootStackParamList = {
  Setup: undefined;
  Feed: { source: RssSource };
  Detail: { item: RssItem };
  About: undefined;
  Libraries: undefined;
};

// Navigation prop types for each screen
export type SetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Setup'>;
export type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feed'>;
export type FeedScreenRouteProp = RouteProp<RootStackParamList, 'Feed'>;
export type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;
export type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
export type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;
export type LibrariesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Libraries'>;
