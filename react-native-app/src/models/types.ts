// RSS Source - matches SwiftUI RssSource
export interface RssSource {
  title: string;
  url: string;
  rss: string;
  icon?: string;
}

// RSS Item - matches SwiftUI RssItem
export interface RssItem {
  title: string;
  description?: string;
  link: string;
  pubDate?: Date;
}

// Screen State - matches SwiftUI ScreenState<T>
export type ScreenState<T> =
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; data?: T; error: Error };

// Navigation route params
export type RootStackParamList = {
  Setup: undefined;
  Feed: { source: RssSource };
  Detail: { item: RssItem };
  About: undefined;
  Libraries: undefined;
};
