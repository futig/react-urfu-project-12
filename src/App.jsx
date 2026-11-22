import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import '@mantine/core/styles.css';

const App = () => (
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);

export default App;
