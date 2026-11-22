import { create } from 'zustand';

const useChatUiStore = create((set) => ({
  currentChannelId: null,
  activeModal: null,
  setCurrentChannelId: (channelId) => set({ currentChannelId: channelId }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));

export default useChatUiStore;
