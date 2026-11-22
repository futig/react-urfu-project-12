import { Button, Center, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Center mih="100vh" p="md">
    <Stack align="center">
      <Title order={1}>404</Title>
      <Text>Страница не найдена</Text>
      <Button component={Link} to="/" variant="light">
        Вернуться на главную
      </Button>
    </Stack>
  </Center>
);

export default NotFoundPage;
