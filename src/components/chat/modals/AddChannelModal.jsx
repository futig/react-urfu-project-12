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
import { useTranslation } from 'react-i18next';

import { createChannel } from '../../../api/chat.js';
import useAuthStore from '../../../store/authStore.js';
import useChatUiStore from '../../../store/chatUiStore.js';
import validateChannelName from '../../../utils/channelValidation.js';
import { CHANNELS_QUERY_KEY, upsertChannelInCache } from '../../../utils/queryCache.js';
import { showErrorToast, showSuccessToast } from '../../../utils/toast.js';

const AddChannelModal = ({ opened, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const setCurrentChannelId = useChatUiStore((state) => state.setCurrentChannelId);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const channels = queryClient.getQueryData(CHANNELS_QUERY_KEY) ?? [];
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: validateChannelName(channels, t),
    },
  });
  const mutation = useMutation({
    mutationFn: (name) => createChannel(token, name),
    onSuccess: (channel) => {
      upsertChannelInCache(queryClient, channel);
      setCurrentChannelId(channel.id);
      showSuccessToast(
        t(($) => $.notifications.successTitle),
        t(($) => $.notifications.channelCreated, { name: channel.name }),
      );
      onClose();
    },
    onError: (error) => {
      showErrorToast(
        t(($) => $.notifications.errorTitle),
        error instanceof TypeError
          ? t(($) => $.errors.network)
          : t(($) => $.notifications.channelCreateError),
      );
    },
  });

  const handleSubmit = ({ name }) => {
    mutation.mutate(name.trim());
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t(($) => $.modals.add.title)}
      centered
      closeOnClickOutside={!mutation.isPending}
      closeOnEscape={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {mutation.isError && (
            <Alert color="red" variant="light" role="alert">
              {t(($) => $.modals.add.error)}
            </Alert>
          )}
          <TextInput
            data-autofocus
            label={t(($) => $.modals.add.label)}
            placeholder={t(($) => $.modals.add.placeholder)}
            name="name"
            disabled={mutation.isPending}
            {...form.getInputProps('name')}
          />
          <Group justify="flex-end">
            <Button type="button" variant="default" onClick={onClose} disabled={mutation.isPending}>
              {t(($) => $.common.cancel)}
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {t(($) => $.modals.add.submit)}
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddChannelModal;
