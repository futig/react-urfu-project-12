import { Alert, Box, Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMessage } from '../../api/chat.js';
import useAuthStore from '../../store/authStore.js';
import useChatUiStore from '../../store/chatUiStore.js';
import { addMessageToCache } from '../../utils/queryCache.js';

const NewMessageForm = () => {
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const currentChannelId = useChatUiStore((state) => state.currentChannelId);
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      body: '',
    },
    validate: {
      body: (value) => (value.trim() ? null : 'Введите сообщение'),
    },
  });
  const mutation = useMutation({
    mutationFn: (body) => createMessage(token, {
      body,
      channelId: currentChannelId,
      username,
    }),
    onSuccess: (message) => {
      addMessageToCache(queryClient, message);
      form.reset();
    },
  });

  const handleSubmit = ({ body }) => {
    if (!currentChannelId || mutation.isPending) {
      return;
    }

    mutation.mutate(body.trim());
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        {mutation.isError && (
          <Alert color="red" variant="light" role="alert">
            Не удалось отправить сообщение. Проверьте соединение и попробуйте ещё раз.
          </Alert>
        )}
        <Group wrap="nowrap" align="start">
          <TextInput
            aria-label="Новое сообщение"
            placeholder="Введите сообщение..."
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
            Отправить
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default NewMessageForm;
