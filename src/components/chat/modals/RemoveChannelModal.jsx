import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { deleteChannel } from '../../../api/chat.js';
import useAuthStore from '../../../store/authStore.js';
import handleChannelRemoved from '../../../utils/channelRemoval.js';
import { showErrorToast, showSuccessToast } from '../../../utils/toast.js';

const RemoveChannelModal = ({ channel, opened, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: () => deleteChannel(token, channel.id),
    onSuccess: ({ id }) => {
      handleChannelRemoved(queryClient, id);
      showSuccessToast(
        t(($) => $.notifications.successTitle),
        t(($) => $.notifications.channelRemoved, { name: channel.name }),
      );
      onClose();
    },
    onError: (error) => {
      showErrorToast(
        t(($) => $.notifications.errorTitle),
        error instanceof TypeError
          ? t(($) => $.errors.network)
          : t(($) => $.notifications.channelRemoveError),
      );
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t(($) => $.modals.remove.title)}
      centered
      closeOnClickOutside={!mutation.isPending}
      closeOnEscape={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <Stack>
        {mutation.isError && (
          <Alert color="red" variant="light" role="alert">
            {t(($) => $.modals.remove.error)}
          </Alert>
        )}
        <Text>
          {t(($) => $.modals.remove.confirmation, { name: channel.name })}
        </Text>
        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onClose} disabled={mutation.isPending}>
            {t(($) => $.common.cancel)}
          </Button>
          <Button
            color="red"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            {t(($) => $.modals.remove.submit)}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default RemoveChannelModal;
