import * as rssParser from 'react-native-rss-parser';
import { RssSource, RssItem } from '../models/types';

export class FeedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeedError';
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
    throw new Error(`Failed to fetch feed: ${(error as Error).message}`);
  }
}
