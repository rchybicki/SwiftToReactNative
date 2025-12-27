import * as rssParser from 'react-native-rss-parser';
import { RssSource, RssItem } from '../models/types';

export class FeedError extends Error {
  recoverySuggestion?: string;

  constructor(message: string, recoverySuggestion?: string) {
    super(message);
    this.name = 'FeedError';
    this.recoverySuggestion = recoverySuggestion;
  }
}

// Strip HTML tags from text
function stripHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  return html.replace(/<[^>]+>/g, '').trim();
}

export async function fetchFeed(source: RssSource): Promise<RssItem[]> {
  try {
    const response = await fetch(source.rss);
    const responseText = await response.text();
    const feed = await rssParser.parse(responseText);

    if (!feed.items || feed.items.length === 0) {
      throw new FeedError('Feed is empty');
    }

    return feed.items.map((item) => ({
      title: item.title || 'Untitled',
      description: stripHtml(item.description),
      link: item.links?.[0]?.url || item.id || '',
      pubDate: item.published || undefined, // Keep as ISO string for serialization
    }));
  } catch (error) {
    if (error instanceof FeedError) {
      throw error;
    }

    let filename = 'rss';
    try {
      const path = new URL(source.rss).pathname;
      const parts = path.split('/').filter(Boolean);
      if (parts.length > 0) {
        filename = parts[parts.length - 1];
      }
    } catch {
      // Keep default filename fallback.
    }

    throw new FeedError(
      `Internal unresolved error: The file \"${filename}\" couldn't be opened.`,
      "If you're seeing this error you probably should open an issue on github"
    );
  }
}
