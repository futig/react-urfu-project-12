import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

import '@mantine/core/styles.css';

const App = () => (
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={(
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);

export default App;
