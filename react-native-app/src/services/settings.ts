import AsyncStorage from '@react-native-async-storage/async-storage';
import { RssSource } from '../models/types';

const STORAGE_KEY = 'source';

export async function getSettings(): Promise<RssSource | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as RssSource;
  } catch (error) {
    console.error('Error reading settings:', error);
    return null;
  }
}

export async function setSettings(source: RssSource | null): Promise<void> {
  try {
    if (source === null) {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(source));
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}
