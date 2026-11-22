import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteChannel } from '../../../api/chat.js';
import useAuthStore from '../../../store/authStore.js';
import handleChannelRemoved from '../../../utils/channelRemoval.js';

const RemoveChannelModal = ({ channel, opened, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteChannel(token, channel.id),
    onSuccess: ({ id }) => {
      handleChannelRemoved(queryClient, id);
      onClose();
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Удалить канал"
      centered
      closeOnClickOutside={!mutation.isPending}
      closeOnEscape={!mutation.isPending}
      withCloseButton={!mutation.isPending}
    >
      <Stack>
        {mutation.isError && (
          <Alert color="red" variant="light" role="alert">
            Не удалось удалить канал. Попробуйте ещё раз.
          </Alert>
        )}
        <Text>
          {`Вы уверены, что хотите удалить канал # ${channel.name}? Все его сообщения также будут удалены.`}
        </Text>
        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onClose} disabled={mutation.isPending}>
            Отмена
          </Button>
          <Button
            color="red"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            Удалить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default RemoveChannelModal;
