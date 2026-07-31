import { storageHelper } from './storageHelper';
import { STORAGE_KEYS } from '../constants/storage';

export const tokenHelper = {
  getAccessToken: () => storageHelper.get(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => storageHelper.set(STORAGE_KEYS.ACCESS_TOKEN, token),
  getRefreshToken: () => storageHelper.get(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => storageHelper.set(STORAGE_KEYS.REFRESH_TOKEN, token),
  clearTokens: () => {
    storageHelper.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storageHelper.remove(STORAGE_KEYS.REFRESH_TOKEN);
  }
};