import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';

import init from './init.jsx';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
  });
  Sentry.captureException(new Error('Hexlet Chat: Bugsink test'));
}

const app = async () => {
  const socket = io();
  const root = createRoot(document.querySelector('#chat'));

  root.render(await init(socket));
};

app();
