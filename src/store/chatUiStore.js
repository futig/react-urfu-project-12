import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';

export const ChatUiStoreContext = createContext(null);

export const createChatUiStore = () => createStore((set) => ({
  currentChannelId: null,
  activeModal: null,
  setCurrentChannelId: (channelId) => set({ currentChannelId: channelId }),
  openModal: (type, channel = null) => set({ activeModal: { type, channel } }),
  closeModal: () => set({ activeModal: null }),
}));

export const useChatUiStoreApi = () => {
  const store = useContext(ChatUiStoreContext);

  if (!store) {
    throw new Error('useChatUiStoreApi must be used within ChatUiStoreContext.Provider');
  }

  return store;
};

const useChatUiStore = (selector) => {
  const store = useChatUiStoreApi();

  return useStore(store, selector);
};

export default useChatUiStore;
