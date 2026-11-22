import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { io } from 'socket.io-client';

import App from './App.jsx';
import resources from './locales/index.js';
import { AuthStoreContext, createAuthStore } from './store/authStore.js';
import { ChatUiStoreContext, createChatUiStore } from './store/chatUiStore.js';
import handleChannelRemoved from './utils/channelRemoval.js';
import { addMessageToCache, upsertChannelInCache } from './utils/queryCache.js';

const init = async (socket) => {
  const socketInstance = socket ?? io();

  const queryClient = new QueryClient();
  const authStore = createAuthStore();
  const chatUiStore = createChatUiStore();
  const i18n = i18next.createInstance();

  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'ru';
  }
  notifications.clean();

  await i18n.use(initReactI18next).init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    enableSelector: true,
    interpolation: {
      escapeValue: false,
    },
  });

  socketInstance.on('newMessage', (message) => {
    addMessageToCache(queryClient, message);
  });
  socketInstance.on('newChannel', (channel) => {
    upsertChannelInCache(queryClient, channel);
  });
  socketInstance.on('renameChannel', (channel) => {
    upsertChannelInCache(queryClient, channel);
  });
  socketInstance.on('removeChannel', ({ id }) => {
    handleChannelRemoved(queryClient, chatUiStore, id);
  });

  return (
    <AuthStoreContext.Provider value={authStore}>
      <ChatUiStoreContext.Provider value={chatUiStore}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </I18nextProvider>
      </ChatUiStoreContext.Provider>
    </AuthStoreContext.Provider>
  );
};

export default init;
