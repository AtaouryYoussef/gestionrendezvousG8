import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = '@smartqueue:collection:';
const collectionKey = (collectionName) => `${KEY_PREFIX}${collectionName}`;
const readCollection = async (collectionName) => {
  const raw = await AsyncStorage.getItem(collectionKey(collectionName));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const writeCollection = async (collectionName, data) => {
  await AsyncStorage.setItem(
    collectionKey(collectionName),
    JSON.stringify(Array.isArray(data) ? data : [])
  );
};

export const connectToNoSQL = async () => {
  return true;
};

export const getCollection = async (collectionName) => {
  return await readCollection(collectionName);
};

export const insertDocument = async (collectionName, document) => {
  const col = await readCollection(collectionName);
  col.push(document);
  await writeCollection(collectionName, col);
  return document;
};

export const updateDocument = async (collectionName, documentId, update) => {
  const col = await readCollection(collectionName);
  const idx = col.findIndex((doc) => doc?.id === documentId);

  if (idx !== -1) {
    col[idx] = { ...col[idx], ...update };
    await writeCollection(collectionName, col);
    return col[idx];
  }

  const upserted = { ...update, id: documentId };
  col.push(upserted);
  await writeCollection(collectionName, col);
  return upserted;
};

export const deleteDocument = async (collectionName, documentId) => {
  const col = await readCollection(collectionName);
  const next = col.filter((doc) => doc?.id !== documentId);
  await writeCollection(collectionName, next);
  return true;
};
