import { RssSource } from '../models/types';

const mockParse = jest.fn();

// Mock react-native-rss-parser
jest.mock('react-native-rss-parser', () => ({
  parse: mockParse,
}));

// Mock global fetch
global.fetch = jest.fn();

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
    // Reset module to get fresh imports
    jest.resetModules();
    // Re-mock after reset
    jest.mock('react-native-rss-parser', () => ({
      parse: mockParse,
    }));
    // Re-import after reset
    const feedModule = require('../services/feed');
    fetchFeed = feedModule.fetchFeed;
    FeedError = feedModule.FeedError;

    // Default fetch mock - returns text
    (global.fetch as jest.Mock).mockResolvedValue({
      text: () => Promise.resolve('<rss></rss>'),
    });
  });

  test('fetches and parses RSS feed items', async () => {
    mockParse.mockResolvedValue({
      items: [
        {
          title: 'Test Article',
          links: [{ url: 'https://example.com/article' }],
          description: 'This is a test article',
          published: '2024-01-01T00:00:00Z',
        },
      ],
    });

    const items = await fetchFeed(mockSource);

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Test Article');
    expect(items[0].link).toBe('https://example.com/article');
  });

  test('throws FeedError when feed is empty', async () => {
    mockParse.mockResolvedValue({ items: [] });

    await expect(fetchFeed(mockSource)).rejects.toThrow(FeedError);
  });

  test('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetchFeed(mockSource)).rejects.toThrow();
  });

  test('strips HTML tags from description', async () => {
    mockParse.mockResolvedValue({
      items: [
        {
          title: 'Test',
          links: [{ url: 'https://example.com' }],
          description: '<p>HTML <strong>content</strong></p>',
        },
      ],
    });

    const items = await fetchFeed(mockSource);

    expect(items[0].description).not.toContain('<p>');
    expect(items[0].description).not.toContain('<strong>');
  });
});
