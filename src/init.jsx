import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import App from './App.jsx';
import resources from './locales/index.js';
import handleChannelRemoved from './utils/channelRemoval.js';
import { addMessageToCache, upsertChannelInCache } from './utils/queryCache.js';

const init = async (socket) => {
  if (!socket) {
    throw new Error('Socket instance is required');
  }

  const queryClient = new QueryClient();
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    enableSelector: true,
    interpolation: {
      escapeValue: false,
    },
  });

  socket.on('newMessage', (message) => {
    addMessageToCache(queryClient, message);
  });
  socket.on('newChannel', (channel) => {
    upsertChannelInCache(queryClient, channel);
  });
  socket.on('renameChannel', (channel) => {
    upsertChannelInCache(queryClient, channel);
  });
  socket.on('removeChannel', ({ id }) => {
    handleChannelRemoved(queryClient, id);
  });

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default init;
