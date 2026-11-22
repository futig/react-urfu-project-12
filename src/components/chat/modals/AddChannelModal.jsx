import {
  Alert,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createChannel } from '../../../api/chat.js';
import useAuthStore from '../../../store/authStore.js';
import useChatUiStore from '../../../store/chatUiStore.js';
import validateChannelName from '../../../utils/channelValidation.js';
import { CHANNELS_QUERY_KEY, upsertChannelInCache } from '../../../utils/queryCache.js';

const AddChannelModal = ({ opened, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const setCurrentChannelId = useChatUiStore((state) => state.setCurrentChannelId);
  const queryClient = useQueryClient();
  const channels = queryClient.getQueryData(CHANNELS_QUERY_KEY) ?? [];
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: validateChannelName(channels),
    },
  });
  const mutation = useMutation({
    mutationFn: (name) => createChannel(token, name),
    onSuccess: (channel) => {
      upsertChannelInCache(queryClient, channel);
      setCurrentChannelId(channel.id);
      onClose();
    },
  });

  const handleSubmit = ({ name }) => {
    mutation.mutate(name.trim());
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Добавить канал"
      centered
      closeOnClickOutside={!mutation.isPending}
      closeOnEscape={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {mutation.isError && (
            <Alert color="red" variant="light" role="alert">
              Не удалось добавить канал. Попробуйте ещё раз.
            </Alert>
          )}
          <TextInput
            data-autofocus
            label="Название канала"
            placeholder="Например, frontend"
            name="name"
            disabled={mutation.isPending}
            {...form.getInputProps('name')}
          />
          <Group justify="flex-end">
            <Button type="button" variant="default" onClick={onClose} disabled={mutation.isPending}>
              Отмена
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Добавить
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddChannelModal;
