import { Box, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import cleanText from '../../utils/profanity.js';

const MessagesList = ({ messages }) => {
  const { t } = useTranslation();

  if (messages.length === 0) {
    return <Text c="dimmed">{t(($) => $.messages.empty)}</Text>;
  }

  return (
    <Stack gap="sm">
      {messages.map(({ id, username, body }) => (
        <Box key={id} maw="100%" style={{ overflowWrap: 'anywhere' }}>
          <Text component="span" fw={700}>
            {username}:{' '}
          </Text>
          <Text component="span">{cleanText(body)}</Text>
        </Box>
      ))}
    </Stack>
  );
};

export default MessagesList;
