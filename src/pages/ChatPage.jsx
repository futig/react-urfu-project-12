import { useEffect, useMemo } from 'react';
import {
  ActionIcon,
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
import ChannelModals from '../components/chat/ChannelModals.jsx';
import ChannelsList from '../components/chat/ChannelsList.jsx';
import MessagesList from '../components/chat/MessagesList.jsx';
import NewMessageForm from '../components/chat/NewMessageForm.jsx';
import useAuthStore from '../store/authStore.js';
import useChatUiStore from '../store/chatUiStore.js';
import { CHANNELS_QUERY_KEY, MESSAGES_QUERY_KEY } from '../utils/queryCache.js';

const ChatPage = () => {
  const token = useAuthStore((state) => state.token);
  const currentChannelId = useChatUiStore((state) => state.currentChannelId);
  const setCurrentChannelId = useChatUiStore((state) => state.setCurrentChannelId);
  const openModal = useChatUiStore((state) => state.openModal);
  const channelsQuery = useQuery({
    queryKey: CHANNELS_QUERY_KEY,
    queryFn: () => getChannels(token),
    enabled: Boolean(token),
  });
  const messagesQuery = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: () => getMessages(token),
    enabled: Boolean(token),
  });
  const channels = useMemo(() => channelsQuery.data ?? [], [channelsQuery.data]);
  const messages = messagesQuery.data ?? [];

  useEffect(() => {
    const channelExists = channels.some(({ id }) => id === currentChannelId);

    if (channels.length > 0 && !channelExists) {
      const defaultChannel = channels.find(({ name }) => name === 'general') ?? channels[0];
      setCurrentChannelId(defaultChannel.id);
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
  const currentChannelName = currentChannel ? `# ${currentChannel.name}` : 'Канал не выбран';

  return (
    <>
      <Group gap={0} align="stretch" wrap="nowrap" h="100vh">
        <Paper component="aside" w={260} p="md" radius={0} withBorder>
          <Stack h="100%">
            <Group justify="space-between" wrap="nowrap">
              <Title order={3}>Каналы</Title>
              <ActionIcon
                type="button"
                variant="light"
                aria-label="Добавить канал"
                onClick={() => openModal('add')}
              >
                <span aria-hidden="true">+</span>
              </ActionIcon>
            </Group>
            <ScrollArea flex={1} mih={0}>
              <ChannelsList
                channels={channels}
                currentChannelId={currentChannel?.id}
                onSelect={setCurrentChannelId}
                onRename={(channel) => openModal('rename', channel)}
                onRemove={(channel) => openModal('remove', channel)}
              />
            </ScrollArea>
          </Stack>
        </Paper>
        <Stack flex={1} miw={0} mih={0} p="md">
          <Title order={2} style={{ overflowWrap: 'anywhere' }}>
            {currentChannelName}
          </Title>
          <ScrollArea flex={1} mih={0}>
            <MessagesList messages={currentMessages} />
          </ScrollArea>
          <NewMessageForm />
        </Stack>
      </Group>
      <ChannelModals />
    </>
  );
};

export default ChatPage;
