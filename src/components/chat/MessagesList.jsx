import { Box, Stack, Text } from '@mantine/core';

const MessagesList = ({ messages }) => {
  if (messages.length === 0) {
    return <Text c="dimmed">В этом канале пока нет сообщений</Text>;
  }

  return (
    <Stack gap="sm">
      {messages.map(({ id, username, body }) => (
        <Box key={id} maw="100%" style={{ overflowWrap: 'anywhere' }}>
          <Text component="span" fw={700}>
            {username}:{' '}
          </Text>
          <Text component="span">{body}</Text>
        </Box>
      ))}
    </Stack>
  );
};

export default MessagesList;
