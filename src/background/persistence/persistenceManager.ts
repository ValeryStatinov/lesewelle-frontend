const getItem = async <T>(key: string): Promise<T | undefined> => {
  const item = await chrome.storage.local.get<{ [key: string]: T | undefined }>(key);

  return item[key];
};

const setItem = async <T>(key: string, value: T): Promise<void> => {
  await chrome.storage.local.set({ [key]: value });
};

const removeItem = async (key: string): Promise<void> => {
  await chrome.storage.local.remove(key);
};

export const persistenceManager = {
  getItem,
  setItem,
  removeItem,
};
