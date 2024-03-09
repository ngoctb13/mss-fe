import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './invoiceSlice.js';
import { loadState, saveState } from './storeUtils.js';


const persistedState = loadState();

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
    saveState(store.getState()); // Lưu state mới mỗi khi có thay đổi
});
