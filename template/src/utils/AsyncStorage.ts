import AsyncStorage from '@react-native-async-storage/async-storage';

//Store data in localstorage
export const storeItem = async <T>(key: string, value: T): Promise<T> => {
  return await AsyncStorage.setItem(key, value);
};

// get data from localstorage
export const getItem = async <ReturnType>(key: string): Promise<ReturnType> => {
  await AsyncStorage.getItem(key);
};

// clear all data in localstorage
export const clearLocalStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(keys);
};

// remove data from localstore
export const removeItem = async (key: string) => {
  return await AsyncStorage.removeItem(key);
};
