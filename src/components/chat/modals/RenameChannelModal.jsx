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

import { renameChannel } from '../../../api/chat.js';
import useAuthStore from '../../../store/authStore.js';
import validateChannelName from '../../../utils/channelValidation.js';
import { CHANNELS_QUERY_KEY, upsertChannelInCache } from '../../../utils/queryCache.js';

const RenameChannelModal = ({ channel, opened, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const channels = queryClient.getQueryData(CHANNELS_QUERY_KEY) ?? [];
  const form = useForm({
    initialValues: {
      name: channel.name,
    },
    validate: {
      name: validateChannelName(channels, channel.id),
    },
  });
  const mutation = useMutation({
    mutationFn: (name) => renameChannel(token, channel.id, name),
    onSuccess: (updatedChannel) => {
      upsertChannelInCache(queryClient, updatedChannel);
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
      title="Переименовать канал"
      centered
      closeOnClickOutside={!mutation.isPending}
      closeOnEscape={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {mutation.isError && (
            <Alert color="red" variant="light" role="alert">
              Не удалось переименовать канал. Попробуйте ещё раз.
            </Alert>
          )}
          <TextInput
            data-autofocus
            label="Новое название канала"
            name="name"
            disabled={mutation.isPending}
            {...form.getInputProps('name')}
          />
          <Group justify="flex-end">
            <Button type="button" variant="default" onClick={onClose} disabled={mutation.isPending}>
              Отмена
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RenameChannelModal;
