import Parser from 'rss-parser';
import { RssSource, RssItem } from '../models/types';

export class FeedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeedError';
  }
}

// Lazy initialization to allow for mocking
let parser: Parser | null = null;

function getParser(): Parser {
  if (!parser) {
    parser = new Parser();
  }
  return parser;
}

// Strip HTML tags from text
function stripHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  return html.replace(/<[^>]+>/g, '').trim();
}

export async function fetchFeed(source: RssSource): Promise<RssItem[]> {
  try {
    const feed = await getParser().parseURL(source.rss);

    if (!feed.items || feed.items.length === 0) {
      throw new FeedError('Feed is empty');
    }

    return feed.items.map((item) => ({
      title: item.title || 'Untitled',
      description: stripHtml(item.contentSnippet || item.content),
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : undefined,
    }));
  } catch (error) {
    if (error instanceof FeedError) {
      throw error;
    }
    throw new Error(`Failed to fetch feed: ${(error as Error).message}`);
  }
}
