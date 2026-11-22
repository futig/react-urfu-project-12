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
import { useTranslation } from 'react-i18next';

import { getChannels, getMessages } from '../api/chat.js';
import ChannelModals from '../components/chat/ChannelModals.jsx';
import ChannelsList from '../components/chat/ChannelsList.jsx';
import MessagesList from '../components/chat/MessagesList.jsx';
import NewMessageForm from '../components/chat/NewMessageForm.jsx';
import useAuthStore from '../store/authStore.js';
import useChatUiStore from '../store/chatUiStore.js';
import { CHANNELS_QUERY_KEY, MESSAGES_QUERY_KEY } from '../utils/queryCache.js';
import { showErrorToast } from '../utils/toast.js';

const ChatPage = () => {
  const token = useAuthStore((state) => state.token);
  const currentChannelId = useChatUiStore((state) => state.currentChannelId);
  const setCurrentChannelId = useChatUiStore((state) => state.setCurrentChannelId);
  const openModal = useChatUiStore((state) => state.openModal);
  const { t } = useTranslation();
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
    const channelExists = channels.some(({ id }) => String(id) === String(currentChannelId));

    if (channels.length > 0 && !channelExists) {
      const defaultChannel = channels.find(({ name }) => name === 'general') ?? channels[0];
      setCurrentChannelId(defaultChannel.id);
    }
  }, [channels, currentChannelId, setCurrentChannelId]);

  const hasLoadError = channelsQuery.isError || messagesQuery.isError;

  useEffect(() => {
    if (hasLoadError) {
      showErrorToast(
        t(($) => $.notifications.loadError),
        'chat-load-error',
      );
    }
  }, [hasLoadError, t]);

  if (channelsQuery.isPending || messagesQuery.isPending) {
    return (
      <Center h="100%">
        <Loader aria-label={t(($) => $.chat.loading)} />
      </Center>
    );
  }

  if (hasLoadError) {
    return (
      <Center h="100%" p="md">
        <Alert color="red" title={t(($) => $.chat.loadErrorTitle)} maw={500}>
          {t(($) => $.chat.loadError)}
        </Alert>
      </Center>
    );
  }

  const currentChannel = channels.find(({ id }) => String(id) === String(currentChannelId)) ?? channels[0];
  const currentMessages = currentChannel
    ? messages.filter(({ channelId }) => String(channelId) === String(currentChannel.id))
    : [];
  const currentChannelName = currentChannel
    ? `# ${currentChannel.name}`
    : t(($) => $.chat.noChannel);

  return (
    <>
      <Group gap={0} align="stretch" wrap="nowrap" h="100%">
        <Paper component="aside" w={260} p="md" radius={0} withBorder>
          <Stack h="100%">
            <Group justify="space-between" wrap="nowrap">
              <Title order={3}>{t(($) => $.chat.channels)}</Title>
              <ActionIcon
                type="button"
                variant="light"
                title={t(($) => $.chat.addChannel)}
                onClick={() => openModal('add')}
              >
                <span>+</span>
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
