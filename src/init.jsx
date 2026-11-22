import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.jsx';
import handleChannelRemoved from './utils/channelRemoval.js';
import { addMessageToCache, upsertChannelInCache } from './utils/queryCache.js';

const init = async (socket) => {
  if (!socket) {
    throw new Error('Socket instance is required');
  }

  const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

export default init;
