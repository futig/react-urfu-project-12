import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.jsx';
import { addMessageToCache } from './utils/queryCache.js';

const init = async (socket) => {
  if (!socket) {
    throw new Error('Socket instance is required');
  }

  const queryClient = new QueryClient();

  socket.on('newMessage', (message) => {
    addMessageToCache(queryClient, message);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

export default init;
