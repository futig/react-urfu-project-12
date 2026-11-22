import { Anchor, Box, Button, Group, Paper, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore.js';
import useChatUiStore from '../store/chatUiStore.js';

const AppLayout = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const setCurrentChannelId = useChatUiStore((state) => state.setCurrentChannelId);
  const closeModal = useChatUiStore((state) => state.closeModal);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    setCurrentChannelId(null);
    closeModal();
    navigate('/login', { replace: true });
  };

  return (
    <Stack gap={0} h="100vh">
      <Paper component="header" withBorder radius={0} p="md">
        <Group justify="space-between" maw={1200} mx="auto">
          <Anchor
            component={Link}
            to="/"
            size="xl"
            fw={700}
            underline="hover"
          >
            {t(($) => $.header.title)}
          </Anchor>
          {token && (
            <Button variant="light" onClick={handleLogout}>
              {t(($) => $.header.logout)}
            </Button>
          )}
        </Group>
      </Paper>
      <Box component="main" flex={1} mih={0}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default AppLayout;
