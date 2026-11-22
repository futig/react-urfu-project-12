import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.jsx';

const init = async (socket) => {
  if (!socket) {
    throw new Error('Socket instance is required');
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

export default init;
