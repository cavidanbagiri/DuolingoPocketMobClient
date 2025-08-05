// services/storage.js
import * as SecureStore from 'expo-secure-store';

export const saveToStorage = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
};

export const getFromStorage = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.error(`Failed to get ${key}:`, err);
    return null;
  }
};

export const clearStorage = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('sub');
    await SecureStore.deleteItemAsync('username');
    await SecureStore.deleteItemAsync('native');
    // await SecureStore.deleteItemAsync('target');
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
};
