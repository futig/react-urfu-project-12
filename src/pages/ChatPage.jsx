import { Button, Center, Stack, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

const ChatPage = () => (
  <Center mih="100vh">
    <Stack align="center">
      <Title>Hexlet Chat</Title>
      <Button component={Link} to="/login">
        Войти
      </Button>
    </Stack>
  </Center>
);

export default ChatPage;
