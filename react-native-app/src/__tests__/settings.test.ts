import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSettings, setSettings } from '../services/settings';
import { RssSource } from '../models/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockSource: RssSource = {
  title: 'Test Feed',
  url: 'https://example.com',
  rss: 'https://example.com/feed.xml',
  icon: 'https://example.com/icon.png',
};

describe('Settings Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Migrated from: testInitialGet
  test('returns null when nothing is saved', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await getSettings();

    expect(result).toBeNull();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('source');
  });

  // Migrated from: testSetAndGet
  test('persists and retrieves RssSource', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSource));

    await setSettings(mockSource);
    const result = await getSettings();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('source', JSON.stringify(mockSource));
    expect(result).toEqual(mockSource);
  });

  // Migrated from: testRemoving
  test('removes source when set to null', async () => {
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    await setSettings(null);
    const result = await getSettings();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('source');
    expect(result).toBeNull();
  });
});
