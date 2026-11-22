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

import { renameChannel } from '../../../api/chat.js';
import useAuthStore from '../../../store/authStore.js';
import validateChannelName from '../../../utils/channelValidation.js';
import cleanText from '../../../utils/profanity.js';
import { CHANNELS_QUERY_KEY, upsertChannelInCache } from '../../../utils/queryCache.js';
import { showErrorToast, showSuccessToast } from '../../../utils/toast.js';

const RenameChannelModal = ({ channel, opened, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const channels = queryClient.getQueryData(CHANNELS_QUERY_KEY) ?? [];
  const form = useForm({
    initialValues: {
      name: channel.name,
    },
    validate: {
      name: validateChannelName(channels, t, channel.id),
    },
  });
  const mutation = useMutation({
    mutationFn: (name) => renameChannel(token, channel.id, name),
    onSuccess: (updatedChannel) => {
      upsertChannelInCache(queryClient, updatedChannel);
      showSuccessToast(
        t(($) => $.notifications.successTitle),
        t(($) => $.notifications.channelRenamed, { name: updatedChannel.name }),
      );
      onClose();
    },
    onError: (error) => {
      showErrorToast(
        t(($) => $.notifications.errorTitle),
        error instanceof TypeError
          ? t(($) => $.errors.network)
          : t(($) => $.notifications.channelRenameError),
      );
    },
  });

  const handleSubmit = ({ name }) => {
    mutation.mutate(cleanText(name.trim()));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t(($) => $.modals.rename.title)}
      centered
      closeOnClickOutside={!mutation.isPending}
      closeOnEscape={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {mutation.isError && (
            <Alert color="red" variant="light" role="alert">
              {t(($) => $.modals.rename.error)}
            </Alert>
          )}
          <TextInput
            data-autofocus
            label={t(($) => $.modals.rename.label)}
            name="name"
            disabled={mutation.isPending}
            {...form.getInputProps('name')}
          />
          <Group justify="flex-end">
            <Button type="button" variant="default" onClick={onClose} disabled={mutation.isPending}>
              {t(($) => $.common.cancel)}
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {t(($) => $.modals.rename.submit)}
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RenameChannelModal;
