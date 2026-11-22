import { useEffect, useRef } from 'react';
import { Alert, Box, Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { createMessage } from '../../api/chat.js';
import useAuthStore from '../../store/authStore.js';
import useChatUiStore from '../../store/chatUiStore.js';
import cleanText from '../../utils/profanity.js';
import { addMessageToCache } from '../../utils/queryCache.js';
import { showErrorToast } from '../../utils/toast.js';

const NewMessageForm = () => {
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const currentChannelId = useChatUiStore((state) => state.currentChannelId);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const form = useForm({
    initialValues: {
      body: '',
    },
    validate: {
      body: (value) => (value.trim() ? null : t(($) => $.messages.required)),
    },
  });
  useEffect(() => {
    if (currentChannelId) {
      inputRef.current?.focus();
    }
  }, [currentChannelId]);
  const mutation = useMutation({
    mutationFn: (body) => createMessage(token, {
      body,
      channelId: currentChannelId,
      username,
    }),
    onSuccess: (message) => {
      addMessageToCache(queryClient, message);
      form.reset();
      inputRef.current?.focus();
    },
    onError: (error) => {
      showErrorToast(
        error instanceof TypeError
          ? t(($) => $.errors.network)
          : t(($) => $.notifications.messageSendError),
      );
    },
  });

  const handleSubmit = ({ body }) => {
    if (!currentChannelId || mutation.isPending) {
      return;
    }

    mutation.mutate(cleanText(body.trim()));
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        {mutation.isError && (
          <Alert color="red" variant="light" role="alert">
            {t(($) => $.messages.sendError)}
          </Alert>
        )}
        <Group wrap="nowrap" align="start">
          <TextInput
            ref={inputRef}
            aria-label={t(($) => $.messages.label)}
            placeholder={t(($) => $.messages.placeholder)}
            name="body"
            flex={1}
            disabled={mutation.isPending}
            {...form.getInputProps('body')}
          />
          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={!currentChannelId}
          >
            {t(($) => $.messages.submit)}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default NewMessageForm;
