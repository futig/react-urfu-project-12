import { create } from 'zustand';

const useChatUiStore = create((set) => ({
  currentChannelId: null,
  activeModal: null,
  setCurrentChannelId: (channelId) => set({ currentChannelId: channelId }),
  openModal: (type, channel = null) => set({ activeModal: { type, channel } }),
  closeModal: () => set({ activeModal: null }),
}));

export default useChatUiStore;
