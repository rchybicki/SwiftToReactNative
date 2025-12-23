import { RssSource } from '../models/types';

const mockParseURL = jest.fn();

// Mock rss-parser before importing feed service
jest.mock('rss-parser', () => {
  return jest.fn().mockImplementation(() => ({
    parseURL: mockParseURL,
  }));
});

const mockSource: RssSource = {
  title: 'Test Feed',
  url: 'https://example.com',
  rss: 'https://example.com/feed.xml',
};

describe('Feed Service', () => {
  let fetchFeed: typeof import('../services/feed').fetchFeed;
  let FeedError: typeof import('../services/feed').FeedError;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset module to get fresh parser instance
    jest.resetModules();
    // Re-mock after reset
    jest.mock('rss-parser', () => {
      return jest.fn().mockImplementation(() => ({
        parseURL: mockParseURL,
      }));
    });
    // Re-import after reset
    const feedModule = require('../services/feed');
    fetchFeed = feedModule.fetchFeed;
    FeedError = feedModule.FeedError;
  });

  test('fetches and parses RSS feed items', async () => {
    mockParseURL.mockResolvedValue({
      items: [
        {
          title: 'Test Article',
          link: 'https://example.com/article',
          contentSnippet: 'This is a test article',
          pubDate: '2024-01-01T00:00:00Z',
        },
      ],
    });

    const items = await fetchFeed(mockSource);

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Test Article');
    expect(items[0].link).toBe('https://example.com/article');
  });

  test('throws FeedError when feed is empty', async () => {
    mockParseURL.mockResolvedValue({ items: [] });

    await expect(fetchFeed(mockSource)).rejects.toThrow(FeedError);
  });

  test('handles network errors', async () => {
    mockParseURL.mockRejectedValue(new Error('Network error'));

    await expect(fetchFeed(mockSource)).rejects.toThrow();
  });

  test('strips HTML tags from description', async () => {
    mockParseURL.mockResolvedValue({
      items: [
        {
          title: 'Test',
          link: 'https://example.com',
          contentSnippet: '<p>HTML <strong>content</strong></p>',
        },
      ],
    });

    const items = await fetchFeed(mockSource);

    expect(items[0].description).not.toContain('<p>');
    expect(items[0].description).not.toContain('<strong>');
  });
});
