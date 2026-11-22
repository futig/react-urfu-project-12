import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';

import init from './init.jsx';
import './index.css';

const app = async () => {
  const socket = io();
  const root = createRoot(document.querySelector('#chat'));

  root.render(await init(socket));
};

app();
