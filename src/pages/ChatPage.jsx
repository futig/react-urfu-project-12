import { useEffect, useMemo } from 'react';
import {
  Alert,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { getChannels, getMessages } from '../api/chat.js';
import ChannelsList from '../components/chat/ChannelsList.jsx';
import MessagesList from '../components/chat/MessagesList.jsx';
import NewMessageForm from '../components/chat/NewMessageForm.jsx';
import useAuthStore from '../store/authStore.js';
import useChatUiStore from '../store/chatUiStore.js';

const ChatPage = () => {
  const token = useAuthStore((state) => state.token);
  const currentChannelId = useChatUiStore((state) => state.currentChannelId);
  const setCurrentChannelId = useChatUiStore((state) => state.setCurrentChannelId);
  const channelsQuery = useQuery({
    queryKey: ['channels'],
    queryFn: () => getChannels(token),
    enabled: Boolean(token),
  });
  const messagesQuery = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessages(token),
    enabled: Boolean(token),
  });
  const channels = useMemo(() => channelsQuery.data ?? [], [channelsQuery.data]);
  const messages = messagesQuery.data ?? [];

  useEffect(() => {
    const channelExists = channels.some(({ id }) => id === currentChannelId);

    if (channels.length > 0 && !channelExists) {
      setCurrentChannelId(channels[0].id);
    }
  }, [channels, currentChannelId, setCurrentChannelId]);

  if (channelsQuery.isPending || messagesQuery.isPending) {
    return (
      <Center h="100vh">
        <Loader aria-label="Загрузка чата" />
      </Center>
    );
  }

  if (channelsQuery.isError || messagesQuery.isError) {
    return (
      <Center h="100vh" p="md">
        <Alert color="red" title="Ошибка загрузки" maw={500}>
          Не удалось загрузить данные чата. Попробуйте обновить страницу.
        </Alert>
      </Center>
    );
  }

  const currentChannel = channels.find(({ id }) => id === currentChannelId) ?? channels[0];
  const currentMessages = currentChannel
    ? messages.filter(({ channelId }) => channelId === currentChannel.id)
    : [];

  return (
    <Group gap={0} align="stretch" wrap="nowrap" h="100vh">
      <Paper component="aside" w={260} p="md" radius={0} withBorder>
        <Stack>
          <Title order={3}>Каналы</Title>
          <ChannelsList
            channels={channels}
            currentChannelId={currentChannel?.id}
            onSelect={setCurrentChannelId}
          />
        </Stack>
      </Paper>
      <Stack flex={1} mih={0} p="md">
        <Title order={2}>
          {currentChannel ? `# ${currentChannel.name}` : 'Канал не выбран'}
        </Title>
        <ScrollArea flex={1} mih={0}>
          <MessagesList messages={currentMessages} />
        </ScrollArea>
        <NewMessageForm />
      </Stack>
    </Group>
  );
};

export default ChatPage;
