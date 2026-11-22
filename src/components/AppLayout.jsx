import { Anchor, Box, Button, Group, Paper, Stack } from '@mantine/core';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore.js';

const AppLayout = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
            Hexlet Chat
          </Anchor>
          {token && (
            <Button variant="light" onClick={handleLogout}>
              Выйти
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
